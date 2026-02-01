#include <jni.h>
#include "NitroExpoWidgetKitOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::expowidgetkit::initialize(vm);
}
