/*

// reference
http://www.openspc2.org/book/PhotoshopCS5/
http://www.openspc2.org/book/PhotoshopCS6/
http://d.hatena.ne.jp/itouhiro/20090615

// To do
- rename / numbering
var num = 1;		// start from
var digit = 4; 	// file name digit
- multi extension (now only for .jpg)
- error handling

*/

/*------------------------------
	size
------------------------------*/

var defSize = 1280;		

/*------------------------------
	destination folder
------------------------------*/

//	Mac --> Macintosh HD/psjsx\dest
//	Win --> C:\psjsx\dest

var	dest = "/psjsx/dest";	


/*------------------------------
	Run
------------------------------*/

// Go!
main();


/*------------------------------
	main
------------------------------*/

function main() {
	// set value in dialog
	setValue();
	// set units
	preferences.rulerUnits = Units.PIXELS;
	// set target folder
	setFolder();
	
	// set source folder
	var folderObj = Folder.selectDialog("choose a souce folder");
	// get .jpg files
	var files = folderObj.getFiles("*.jpg");
	// get array length
	var len = files.length;
	
	// save files
	for(var i = 0; i < len; i++){
	    // open a file
	    var theDoc = app.open(files[i]);
	    // mode: RGB
	    theDoc.changeMode(ChangeMode.RGB);
	    // resize width & height
		resize(theDoc);
		// save as jpg
		savejpg(theDoc);
		// close
		theDoc.close(SaveOptions.DONOTSAVECHANGES);
	}
}

/*------------------------------
	set value
------------------------------*/

function setValue() {
	// window
	var dlgLeft = 100;
	var dlgTop = 100;
	var dlgWidth = 150;
	var dlgHeight = 80;
	// input box
	var dlgBoxTop = 10;
	var dlgBoxLeft = 10;
	var dlgBoxWidth = 130;
	var dlgBoxHeight = 25;
	// button
	var dlgBtnTop = 45;
	var dlgBtnWidth = 65;
	var dlgBtnHeight = 25;
	// button
	var dlgOkLeft = 10;
	var dlgCancelLeft = 75;

	var ok_flag = true;

	// window
	var uDlg = new Window(
		'dialog',
		'set size',
		[dlgLeft, dlgTop, dlgLeft + dlgWidth, dlgTop + dlgHeight]
	);
	
	// text
	uDlg.eText = uDlg.add(
		"edittext",
		[dlgBoxLeft, dlgBoxTop, dlgBoxLeft + dlgBoxWidth, dlgBoxTop + dlgBtnHeight],
		defSize
	);

	// ok button
	uDlg.okBtn = uDlg.add(
		"button",
		[dlgOkLeft, dlgBtnTop, dlgOkLeft+ dlgBtnWidth, dlgBtnTop + dlgBtnHeight],
		"OK",
		{ name:"ok"}
	);
	
	// cancel button
	uDlg.cancelBtn = uDlg.add(
		"button",
		[dlgCancelLeft, dlgBtnTop, dlgCancelLeft + dlgBtnWidth, dlgBtnTop + dlgBtnHeight],
		"Cancel",
		{name: "cancel"}
	);

	// align dialog center
	uDlg.center();

	// when cancel button is pressed (or ESC is pressed)
	uDlg.cancelBtn.onClick = function() {
		// input 0
		ok_flag = false;
		uDlg.close();
	}
	 
	// show dialog
	uDlg.show();
	
	// parse text to integral
	targetSize = parseInt(uDlg.eText.text);

	// put Integral number
	if (ok_flag && targetSize > 0) {
	} else {
		alert("input an integral number");
		ok_flag = false;
		uDlg.close();
	}

	// if(!ok_flag) {
	// 	alert("ERRRO");
	// 	return;
	// }

}

/*------------------------------
	set Folder
------------------------------*/

function setFolder() {
	var myFolder = new Folder(dest);

	// create folder
	if(!myFolder.exists) {
		myFolder.create();
	} else {
		alert("That folder already exists!");
	}
}


/*------------------------------
	resize
------------------------------*/

function resize(doc) {
	// get width & height
	var w = doc.width;
	var h = doc.height;
	var defW;
	var defH;
	var aspect;

	if(w > h) {		// width is longer than height
		aspect = h / w;
		defW = targetSize;
		defH = targetSize * aspect;
	} else {		// height is longer than width
		aspect = w / h;
		defW = targetSize * aspect;
		defH = targetSize;
	}

	// resize
	doc.resizeImage(defW, defH);
}

/*------------------------------
	save as jpg
------------------------------*/

function savejpg(doc) {
	var dName = doc.name;
	var saveFile = File(dest + "/" + dName);
	// var saveFile = File(foldername + "/" + num + ".jpg");
	var jpegOpt = new JPEGSaveOptions();
	jpegOpt.embedColorProfile = true;
	jpegOpt.quality = 8;
	// jpegOpt.formatOptions = FormatOptions.PROGRESSIVE;
	// jpegOpt.scans = 3;
	jpegOpt.matte = MatteType.NONE;
	doc.saveAs(saveFile, jpegOpt, true, Extension.LOWERCASE);
}

