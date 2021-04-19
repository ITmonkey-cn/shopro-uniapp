<<<<<<< HEAD
import validation from './test.js';

// 添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
export default function addUnit(value = 'auto', unit = 'rpx') {
    value = String(value);
	// 用uView内置验证规则中的number判断是否为数值
    return validation.number(value) ? `${value}${unit}` : value;
=======
import validation from './test.js';

// 添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
export default function addUnit(value = 'auto', unit = 'rpx') {
    value = String(value);
	// 用uView内置验证规则中的number判断是否为数值
    return validation.number(value) ? `${value}${unit}` : value;
>>>>>>> 249bc3588ce88ed9a3079aee7eeff9b82ac50fe7
}