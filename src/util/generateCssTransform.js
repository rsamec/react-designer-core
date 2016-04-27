export default function generateCssTransform(transform) {
	var cssTransform = '';

	if (transform.tx !== undefined)  cssTransform += ' translateX(' + transform.tx + 'px)';
	if (transform.ty !== undefined) cssTransform += ' translateY(' + transform.ty + 'px)';
	if (transform.rz !== undefined) cssTransform += ' rotate(' + transform.rz + 'rad)';
	if (transform.sx !== undefined) cssTransform += ' scaleX(' + transform.sx + ')';
	if (transform.sy !== undefined) cssTransform += ' scaleY(' + transform.sy + ')';

	return cssTransform
}
