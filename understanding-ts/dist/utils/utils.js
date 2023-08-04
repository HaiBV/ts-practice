"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autobind = void 0;
function autobind(_, _1, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
exports.autobind = autobind;
