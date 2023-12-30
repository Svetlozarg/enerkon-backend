"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentData = void 0;
const getCurrentData = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
};
exports.getCurrentData = getCurrentData;
//# sourceMappingURL=constants.js.map