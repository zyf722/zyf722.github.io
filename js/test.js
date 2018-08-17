var tl = new Array(
	"I WILL PROTECT YOU NOW.",
	"BELIEVE ME.",
	"I CAN DO EVERYTHING.",
	"WHAT",
	"ARE",
	"YOUR",
	"COMMANDS",
	"?",
	" ",
	"CONNECTING ...",
	" ",
	"DETECT A ERROR.",
	"TERMINATE SAMARITAN."
);
var speed = 50;
var index = 0;
text_pos = 0;
var str_length = tl[0].length;
var contents, row;

function type_text() {
	contents = '';
	row = Math.max(0, index - 0); //index -7
	while (row < index) {
		contents += tl[row++] + '\r\n';
	}
	//document.forms[0].elements[0].value = contents + tl[index].substring(0,text_pos) + "_";
	document.getElementById("Samaria").value = contents + tl[index].substring(0, text_pos);
	if (text_pos++ == str_length) {
		text_pos = 0;
		index++;
		if (index != tl.length) {
			str_length = tl[index].length;
			setTimeout("type_text()", 1500);
		}
	} else
		setTimeout("type_text()", speed);
}