# Zip
Create pkZip files with javaScript

Files can be inserted into your zip file by reading a directory, entering a string or uploading files.


First, download and include the zip.js class in your html and create a new class Zip

```
  <script src='zip.js'></script>
```

```javascript	
  z=new Zip('myZipFileName');
```
Then you can:

  - Load files of your directory to zip object with fecth2zip(filesArray,folder).		

```javascript	
  filesArray=[
    'file01.ext',
    'file02.ext',
    'file...'
  ];
  z.fecth2zip(filesArray,'public/');
```

  - Create a new file from a string  with str2zip(nameFile,content,directory).

```javascript
  z.str2zip('test.txt','content','public/teste/');
```
  - Or upload to zip.
		
    Put onchange event into the input file and send the files to function files2zip(this.files).

```
  <input type="file" onchange="z.files2zip(this.files)" value='files' multiple>
```
		
After placing all the objects inside your Zip object file, just download it.
		
```javascript	
  <input type="button" onclick="z.makeZip()" value='Zip'>
```
