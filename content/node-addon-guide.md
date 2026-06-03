---
title: Beginners guide to writing NodeJS Addons using C++ and N-API (node-addon-api)
date: 2018-06-15
description: How to write Node.js native addons in C++ using N-API — covering function exports, class exports, and passing complex objects between JavaScript and C++.
---

Node.js Addons are dynamically-linked shared objects written in C++ that can be loaded via `require()` and used as ordinary Node.js modules. They primarily interface between JavaScript and C/C++ libraries.

Common reasons to write addons:
- Accessing native APIs difficult to implement in JavaScript alone
- Integrating third-party C/C++ libraries
- Rewriting performance-critical modules in C++

## What is N-API?

N-API (Native API) is an ABI-stable API for building native addons independent of the underlying JavaScript runtime (like V8). It ensures addons compiled for one Node.js version work on later versions without recompilation. N-API became stable in Node v10.

The `node-addon-api` package provides C++ wrapper classes for N-API, offering C++ object models and exception handling with minimal overhead.

## Setting Up: Boilerplate Configuration

### Project Initialization

```bash
mkdir test-addon
cd test-addon
git init
npm init
```

### Installing Dependencies

```bash
npm install node-gyp --save-dev
npm install node-addon-api
```

`node-gyp` compiles the addons. `node-addon-api` simplifies C++ addon development.

### Core Configuration Files

**`.gitignore`**
```
node_modules
*.log
build
```

**`binding.gyp`**
```gyp
{
    "targets": [{
        "target_name": "testaddon",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "cppsrc/main.cpp"
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}
```

**`package.json`**
```json
{
  "name": "test-addon",
  "version": "1.0.0",
  "main": "index.js",
  "gypfile": true,
  "scripts": {
    "build": "node-gyp rebuild",
    "clean": "node-gyp clean"
  },
  "devDependencies": {
    "node-gyp": "^3.7.0"
  },
  "dependencies": {
    "node-addon-api": "^1.3.0"
  }
}
```

**`cppsrc/main.cpp`**
```cpp
#include <napi.h>

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return exports;
}

NODE_API_MODULE(testaddon, InitAll)
```

**`index.js`**
```javascript
const testAddon = require('./build/Release/testaddon.node')

module.exports = testAddon
```

Build with `npm run build`.

### Understanding the Boilerplate

- `#include <napi.h>` includes the N-API header
- `NODE_API_MODULE` registers the module entry point — parameters are module name and init function
- `InitAll` receives `env` (JavaScript runtime context) and `exports` (object for exporting functions/classes)

## Exporting C++ Functions

### Simple Function Export

Create `cppsrc/Samples/functionexample.h`:
```cpp
#include <napi.h>
namespace functionexample {
  std::string hello();
  Napi::String HelloWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}
```

Create `cppsrc/Samples/functionexample.cpp`:
```cpp
#include "functionexample.h"

std::string functionexample::hello(){
  return "Hello World";
}

Napi::String functionexample::HelloWrapped(const Napi::CallbackInfo& info)
{
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, functionexample::hello());
  return returnValue;
}

Napi::Object functionexample::Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(
    "hello", Napi::Function::New(env, functionexample::HelloWrapped)
  );
  return exports;
}
```

Key concepts:
- Every exported function needs a wrapped version (e.g., `HelloWrapped`)
- Wrapped functions take `CallbackInfo` containing context and parameters
- The `Init` function registers the wrapper with the exports object

Update `main.cpp`:
```cpp
#include <napi.h>
#include "Samples/functionexample.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return functionexample::Init(env, exports);
}

NODE_API_MODULE(testaddon, InitAll)
```

Update `index.js`:
```javascript
const testAddon = require('./build/Release/testaddon.node');
console.log('addon', testAddon);
console.log(testAddon.hello());
module.exports = testAddon;
```

After rebuilding: `node index.js` outputs:
```
addon { hello: [Function] }
Hello World
```

### Functions with Parameters

Add an `add` function to `functionexample.cpp`:
```cpp
int functionexample::add(int a, int b){
  return a + b;
}

Napi::Number functionexample::AddWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
    }

    Napi::Number first = info[0].As<Napi::Number>();
    Napi::Number second = info[1].As<Napi::Number>();
    int returnValue = functionexample::add(first.Int32Value(), second.Int32Value());
    return Napi::Number::New(env, returnValue);
}
```

Test with:
```javascript
console.log('add ', testAddon.add(5, 10));
// Output: add 15
```

## Exporting C++ Classes

### Basic Class Structure

Create `cppsrc/Samples/actualclass.h`:
```cpp
class ActualClass {
 public:
  ActualClass(double value);
  double getValue();
  double add(double toAdd);
 private:
  double value_;
};
```

Create `cppsrc/Samples/actualclass.cpp`:
```cpp
#include "actualclass.h"

ActualClass::ActualClass(double value){
    this->value_ = value;
}

double ActualClass::getValue()
{
  return this->value_;
}

double ActualClass::add(double toAdd)
{
  this->value_ += toAdd;
  return this->value_;
}
```

### Creating the Wrapper Class

Create `cppsrc/Samples/classexample.h`:
```cpp
#include <napi.h>
#include "actualclass.h"

class ClassExample : public Napi::ObjectWrap<ClassExample> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  ClassExample(const Napi::CallbackInfo& info);

 private:
  static Napi::FunctionReference constructor;
  Napi::Value GetValue(const Napi::CallbackInfo& info);
  Napi::Value Add(const Napi::CallbackInfo& info);
  ActualClass *actualClass_;
};
```

Create `cppsrc/Samples/classexample.cpp`:
```cpp
#include "classexample.h"

Napi::FunctionReference ClassExample::constructor;

Napi::Object ClassExample::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(env, "ClassExample", {
    InstanceMethod("add", &ClassExample::Add),
    InstanceMethod("getValue", &ClassExample::GetValue),
  });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("ClassExample", func);
  return exports;
}

ClassExample::ClassExample(const Napi::CallbackInfo& info) : Napi::ObjectWrap<ClassExample>(info)  {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);

  int length = info.Length();
  if (length != 1 || !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }

  Napi::Number value = info[0].As<Napi::Number>();
  this->actualClass_ = new ActualClass(value.DoubleValue());
}

Napi::Value ClassExample::GetValue(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);
  double num = this->actualClass_->getValue();
  return Napi::Number::New(env, num);
}

Napi::Value ClassExample::Add(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);

  if (info.Length() != 1 || !info[0].IsNumber()) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }

  Napi::Number toAdd = info[0].As<Napi::Number>();
  double answer = this->actualClass_->add(toAdd.DoubleValue());
  return Napi::Number::New(info.Env(), answer);
}
```

Key concepts:
- Wrapper classes extend `Napi::ObjectWrap<ClassName>`
- `DefineClass` creates the class exported to JavaScript
- `InstanceMethod` registers member functions
- `Napi::FunctionReference` stores the class constructor

Test:
```javascript
const classInstance = new testAddon.ClassExample(4.3);
console.log('Testing class initial value:', classInstance.getValue());
console.log('After adding 3.3:', classInstance.add(3.3));
// Testing class initial value: 4.3
// After adding 3.3: 7.6
```

## Passing Complex Objects Between Worlds

To pass an existing class instance as a constructor argument, use `Napi::ObjectWrap::Unwrap()`:

```cpp
ClassExample::ClassExample(const Napi::CallbackInfo& info) : Napi::ObjectWrap<ClassExample>(info) {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);

  int length = info.Length();
  if (length != 1) {
    Napi::TypeError::New(env, "Only one argument expected").ThrowAsJavaScriptException();
  }

  if(!info[0].IsNumber()){
    Napi::Object object_parent = info[0].As<Napi::Object>();
    ClassExample* example_parent = Napi::ObjectWrap<ClassExample>::Unwrap(object_parent);
    ActualClass* parent_actual_class_instance = example_parent->GetInternalInstance();
    this->actualClass_ = new ActualClass(parent_actual_class_instance->getValue());
    return;
  }

  Napi::Number value = info[0].As<Napi::Number>();
  this->actualClass_ = new ActualClass(value.DoubleValue());
}

ActualClass* ClassExample::GetInternalInstance() {
  return this->actualClass_;
}
```

Test:
```javascript
const prevInstance = new testAddon.ClassExample(4.3);
console.log('Initial value:', prevInstance.getValue());
console.log('After adding 3.3:', prevInstance.add(3.3));

const newFromExisting = new testAddon.ClassExample(prevInstance);
console.log('Value of derived instance:', newFromExisting.getValue());
// Initial value: 4.3
// After adding 3.3: 7.6
// Value of derived instance: 7.6
```

## Summary

N-API provides a stable interface for building Node.js addons in C++. The workflow:

1. Write C++ implementation
2. Create N-API wrapper functions/classes
3. Register exports via `Init`
4. Update `binding.gyp` with source files
5. Rebuild with `npm run build`

## References

- [ABI-Stable Node Addon Examples](https://github.com/nodejs/abi-stable-node-addon-examples/)
- [node-addon-api Repository](https://github.com/nodejs/node-addon-api.git/)
- [Node.js Addons Documentation](https://nodejs.org/api/addons.html)
- [Complete Example Source Code](https://github.com/master-atul/blog-addons-example)
