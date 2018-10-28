// pref.js - functions to import/show/save/export printing preferences


function initPref()
{
	prefCard == null;
}

var prefCardTitle = 'MY~PRINT~PREFERENCES';
var prefArr;
var prefCardOrig;	// (optional)trello card containing preferences
var prefCard;		// (optional)trello card containing preferences
			//  -- it will be set by board.js/readTrello

var prefVal;  		// current preferences

var prefSpec = [

  { type: 'fieldset', name: 'Board 看板' },

  { key: 'showBoardTitle', 
		name: 'Show Board Title 顯示看板標題',
		dflt: true },

  { type: 'fieldset', name: 'Lists 列表'},

  { key: 'numberLists', 
		name: 'Sequentially number lists 列表加上流水號',
		dflt: true },

  { key: 'showListTitle', 
		name: 'Show List Title 顯示列表標題',
		dflt: true },


  { key: 'startListOnNewPage', 
		name: 'Start each list on new page 每個列表呈現在一新頁上',
		dflt: true },

  { key: 'prefaceListNameWithBoard', 
		name: 'Repeat board name when showing list name 列表標題前重複顯示看板標題',
		dflt: false },

  { key: 'showSingleList', 
		name: 'Show option to print list by itself 每個列表標題後都顯示列印選項',
		dflt: false },

  { key: 'showClosedLists', 
		name: 'Show closed lists 顯示已封存的列表',
		dflt: false },


  { name: 'Cards 卡片', type: 'fieldset'},

  { key: 'numberCardsInList', 
		name: 'Sequentially number cards within each list 卡片加上流水號',
		dflt: true },

  { key: 'showCardTitle', 
		name: 'Show Card Title 顯示卡片標題',
		dflt: true },

  { key: 'showCardNumber', 
		name: 'Show Card Id # 顯示卡片編號',
		dflt: true },

  { key: 'showCardLabels', 
		name: 'Show Card Label 顯示卡片標籤',
		type: 'pulldown',
		options: [
			'do-not-show 不顯示',
			'plain-text 純文字',
			'show-color-block 顯示色塊',
			'colored-text 文字色彩',
			'text-in-colored-block 文字在色塊中'
			],
		dflt: 'colored-text' },


  { key: 'showCardMembers', 
		name: 'Show Card Members 顯示卡片成員',
		type: 'pulldown',
		options: [
			'do-not-show 不顯示',
			'show-initials 顯示姓名的首字母',
			'show-fullnames 顯示全名'
			],
		dflt: 'do-not-show' },

  { key: 'showVoteCount', 
		name: 'Show vote count 顯示投票數',
		dflt: true },

  { key: 'showDueDate', 
		name: 'Show Due Date 顯示到期日',
		dflt: true },

  { key: 'showCardCreator', 
		name: 'Show Card Creator 顯示卡片創建者',
		dflt: true },

  { key: 'showCardDesc', 
		name: 'Show Card Description 顯示卡片描述',
		dflt: true },

  { key: 'showClosedCards', 
		name: 'Show Closed Cards 顯示已封存的卡片',
		dflt: false },

  { type: 'fieldset', name: 'Checklists 檢核清單' },

  { key: 'showChecklists', 
		name: 'Show Checklists 顯示檢核清單',
		dflt: true },

  { key: 'showChecklistTitle', 
		name: 'Show Checklist Title 顯示檢核清單標題',
		dflt: true },

  { key: 'showChecklistItems', 
		name: 'Which Checklist Items to show 顯示哪些檢核清單項目',
		type: 'pulldown',
		options: [
			'none 都不要',
			'all 全部都要',
			'unchecked-only 未完成項目',
			'checked-only 已完成項目'],
		dflt: 'all' },

  //add by gsyan to show attachments
  { type: 'fieldset', name: 'Attachments 附件' }, 

  { key: 'showAttachments', 
		name: 'Show Attachments 顯示附件',
		dflt: true },
		
  { key: 'showAttachmentsPictures', 
		name: 'Show Attachments Pictures 顯示附件照片',
		dflt: true },

		
  { type: 'fieldset', name: 'Comments 迴響' }, 

  { key: 'showComments', 
		name: 'Show Comments 顯示迴響',
		dflt: true },

  { key: 'showCommentCreator', 
		name: 'Show Comment Creator 顯示迴響的建立者',
		dflt: true },

  { key: 'showCommentDate', 
		name: 'Show Comment Date 顯示迴響日期',
		dflt: true },
			
  { type: 'fieldset', name: 'People 成員' },

  { key: 'showPersonAs', 
		name: 'When showing people, use 當顯示成員時，使用',
		type: 'pulldown',
		options: [
			'initials 姓名首字',
			'fullname 全名',
			'do-not-show 不顯示名字'
			],
		dflt: 'fullname' },

  { key: 'skipCreatorBefore',
		name: 'Skip names for entries before yyyy-mm-dd 某日期前的條目略過名字', 
		type: 'text',
		dflt: '' }
		

];


function setPrefCard(obj)
{
	if (obj.commArr.length == 0){
		alert('Detected card ' 
				+ prefCardTitle 
				+ '\nbut it does not contain comments'
				+ '\nwith previously saved (json) preferences'
				);
		prefCardOrig = obj;
		prefCard = null;
		return;
	}
	prefCard = obj;
	prefCard.selectedIndex = 0;

	prefCard.parsedJson = [];
	var arr = prefCard.commArr;
	for (var i=0; i<arr.length; i++){
		try {
			var obj = JSON.parse(arr[i].data.text);
			prefCard.parsedJson[i] = obj;
		}
		catch(e){
			alert('error parsing json from '+prefCardTitle+' '+i 
			+ '\n' + 'Are you missing " marks around your nickname?'
			+ '\n\n' + arr[i].data.text);
			continue;
		}
	}
}

function deltaPref(indx)
{
	prefCard.selectedIndex = indx;
	showPrefForm();
}


function showPrefForm()
{
	var pbool = false;

	prefArr = {};

	var htm = [];

	if (prefCard){
		var arr = prefCard.parsedJson;
		var htm = ['Saved preferences from ' +prefCardTitle+ ' card: '];
		var cnt = 0;
		for (var i=0; i<arr.length; i++){
			var obj = arr[i];
			if (obj){ 
				++cnt;
				htm.push('<a href=javascript:deltaPref(',
				i,')>', i+1, ' ', obj.nickname, '</a> &nbsp;');
			}
		}
		if (cnt == 0) htm.push(' <span class=hilite>NONE found - using factory defaults</span>');
		htm.push('<hr>');

		pbool = true;

		var tmp = prefCard.parsedJson[prefCard.selectedIndex];
		if (typeof tmp == 'object') prefArr = tmp;

	}

	// -- not using this anymore
	var el = document.getElementById('prefJsonIN');
	if (el && el.value.match(/{/)){	// }
		pbool = true;
		prefArr = JSON.parse(el.value);
	}

	var fsprev = '';
	htm.push('<form>');
	for (var i=0; i<prefSpec.length; i++){
		var obj = prefSpec[i];

		if (obj.type  == 'fieldset'){
			htm.push(fsprev,'<fieldset><legend>',obj.name,'</legend>');
			fsprev = '</fieldset>';
			continue;
		}

		var x = obj.key;
		var dflt = obj.dflt;

		if (pbool && typeof prefArr[x] != 'undefined'){
			dflt = prefArr[x];
//console.log(' -->',dflt);
		}

		if (typeof obj.dflt == 'boolean'){

			var ckd = '';  if (dflt) ckd = ' CHECKED ';
			htm.push('<p><input type=checkbox name=',x, ckd,'>&nbsp;',obj.name);
			continue;
		}

		if (obj.type == 'pulldown'){
			htm.push('<p> &nbsp; ',obj.name, ' <select name=',x,'>');
			var opt = obj.options;
			for (var j=0; j<opt.length; j++){
				var val = opt[j];
				var ckd = '';
				if (val == dflt) ckd = ' SELECTED ';
				htm.push('<option', ckd,'>',val,'</option>');
			}
			htm.push('</select>');
		}

		if (obj.type == 'text'){
			htm.push('<p> &nbsp; ',obj.name, 
				' <input type=text name=',x, ' value="', dflt,  '">');
		}
	}
	htm.push(fsprev);
	htm.push('<input type=button onClick=savePref(this.form) value=" Save Preferences & Create the Report">');
	htm.push('</form>');

	var el = document.getElementById('PREF_FORM');
	el.innerHTML = htm.join('');

	var el = document.getElementById('prefDiv');
	el.style.display = 'block';

}


function savePref(f)
{
	prefVal = { nickname: 'nickname goes here' };
	for (var i=0; i<prefSpec.length; i++){ 
		var obj = prefSpec[i];
		if (obj.type == 'fieldset') continue;

		var x = obj.key;

		if (typeof obj.dflt == 'boolean'){
			prefVal[x] = f[x].checked; continue;
		}

		if (obj.type == 'pulldown'){
			var opts = f[x].options;
			var indx = f[x].selectedIndex;
			prefVal[x] = opts[indx].value;
		}

		if (obj.type == 'text'){
			prefVal[x] = f[x].value; continue;
		}
	}
//console.log(prefVal);

	var el = document.getElementById('prefJsonOUT');
	el.value = JSON.stringify(prefVal,null,'  ');

	var el = document.getElementById('prefJsonDiv');
	el.style.display = 'block';

	dpyTrello();
}

