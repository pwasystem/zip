class Zip {

	constructor(name) {
		this.name = name;
		this.zip = new Array();
		this.file = new Array();
	}
	
	dec2bin=(dec,size)=>dec.toString(2).padStart(size,'0');
	str2dec=str=>Array.from(new TextEncoder().encode(str));
	str2hex=str=>[...new TextEncoder().encode(str)].map(x=>x.toString(16).padStart(2,'0'));
	hex2buf=hex=>new Uint8Array(hex.split(' ').map(x=>parseInt(x,16)));
	bin2hex=bin=>(parseInt(bin.slice(8),2).toString(16).padStart(2,'0')+' '+parseInt(bin.slice(0,8),2).toString(16).padStart(2,'0'));
	
	reverse=hex=>{
		let hexArray=new Array();
		for(let i=0;i<hex.length;i=i+2)hexArray[i]=hex[i]+''+hex[i+1];
		return hexArray.filter((a)=>a).reverse().join(' ');	
	}
	
	crc32=r=>{
		for(var a,o=[],c=0;c<256;c++){
			a=c;
			for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;
			o[c]=a;
		}
		for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r[t])];
		return this.reverse(((-1^n)>>>0).toString(16).padStart(8,'0'));
	}
	
	fecth2zip(filesArray,folder=''){
		filesArray.forEach(fileUrl=>{
			let resp;				
			fetch(fileUrl).then(response=>{
				resp=response;
				return response.arrayBuffer();
			}).then(blob=>{
				new Response(blob).arrayBuffer().then(buffer=>{
					console.log(`File: ${fileUrl} load`);
					let uint=[...new Uint8Array(buffer)];
					uint.modTime=resp.headers.get('Last-Modified');
					uint.fileUrl=`${this.name}/${folder}${fileUrl}`;							
					this.zip[fileUrl]=uint;
				});
			});				
		});
	}
	
	str2zip(name,str,folder=''){
		let uint=[...new Uint8Array(this.str2dec(str))];
		uint.name=name;
		uint.modTime=new Date();
		uint.fileUrl=`${this.name}/${folder}${name}`;
		this.zip[name]=uint;
	}
	
	files2zip(files,folder=''){
		for(let i=0;i<files.length;i++){
			files[i].arrayBuffer().then(data=>{
				let uint=[...new Uint8Array(data)];
				uint.name=files[i].name;
				uint.modTime=files[i].lastModified;
				uint.fileUrl=`${this.name}/${folder}${files[i].name}`;
				this.zip[uint.fileUrl]=uint;							
			});
		}
	}
	
	makeZip(){
		let count=0;
		let fileHeader='';
		let centralDirectoryFileHeader='';
		let directoryInit=0;
		let offSetLocalHeader='00 00 00 00';
		let zip=this.zip;
		for(const name in zip){
			let lastMod, hour, minutes, seconds, year, month, day;
			let modTime=()=>{
				lastMod=new Date(zip[name].modTime);
				hour=this.dec2bin(lastMod.getHours(),5);
				minutes=this.dec2bin(lastMod.getMinutes(),6);
				seconds=this.dec2bin(Math.round(lastMod.getSeconds()/2),5);
				year=this.dec2bin(lastMod.getFullYear()-1980,7);
				month=this.dec2bin(lastMod.getMonth()+1,4);
				day=this.dec2bin(lastMod.getDate(),5);						
				return this.bin2hex(`${hour}${minutes}${seconds}`)+' '+this.bin2hex(`${year}${month}${day}`);
			}					
			let crc=this.crc32(zip[name]);
			let size=this.reverse(parseInt(zip[name].length).toString(16).padStart(8,'0'));
			let nameFile=this.str2hex(zip[name].fileUrl).join(' ');
            		let nameBytes = new TextEncoder().encode(zip[name].fileUrl);
           		let nameSize = this.reverse(nameBytes.length.toString(16).padStart(4, '0'));
			let fileHeader=`50 4B 03 04 14 00 00 00 00 00 ${modTime()} ${crc} ${size} ${size} ${nameSize} 00 00 ${nameFile}`;
			let fileHeaderBuffer=this.hex2buf(fileHeader);
			directoryInit=directoryInit+fileHeaderBuffer.length+zip[name].length;
			centralDirectoryFileHeader=`${centralDirectoryFileHeader}50 4B 01 02 14 00 14 00 00 00 00 00 ${modTime()} ${crc} ${size} ${size} ${nameSize} 00 00 00 00 00 00 01 00 20 00 00 00 ${offSetLocalHeader} ${nameFile} `;
			offSetLocalHeader=this.reverse(directoryInit.toString(16).padStart(8,'0'));
			this.file.push(fileHeaderBuffer,new Uint8Array(zip[name]));
			count++;
		}
		centralDirectoryFileHeader=centralDirectoryFileHeader.trim();
		let entries=this.reverse(count.toString(16).padStart(4,'0'));
		let dirSize=this.reverse(centralDirectoryFileHeader.split(' ').length.toString(16).padStart(8,'0'));
		let dirInit=this.reverse(directoryInit.toString(16).padStart(8,'0'));
		let centralDirectory=`50 4b 05 06 00 00 00 00 ${entries} ${entries} ${dirSize} ${dirInit} 00 00`;
		
		
		this.file.push(this.hex2buf(centralDirectoryFileHeader),this.hex2buf(centralDirectory));
		
		let a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([...this.file],{type:'application/octet-stream'}));
		console.log(a.href)
		a.download = `${this.name}.zip`;
		a.click();				
	}
}
