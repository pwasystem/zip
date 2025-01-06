# Zip.js

Zip.js is a JavaScript library that enables the creation of PKZip files directly within the browser. It allows you to add files to a zip archive by reading directories, inputting strings, or uploading files.

## Features

- **Add Files from Directory:** Load files from a specified directory into the zip archive.
- **Create Files from Strings:** Generate new files within the zip archive using string content.
- **Upload Files:** Include files selected by the user through file input elements.
- **Generate and Download Zip:** Compile the added files into a zip archive and initiate a download.

## Installation

To use Zip.js in your project, download the `zip.js` file from the repository and include it in your HTML file:

```html
<script src="zip.js"></script>
```

## Usage

1. **Initialize the Zip Object:**

   Create a new instance of the `Zip` class with the desired name for your zip file:

   ```javascript
   const z = new Zip('myZipFileName');
   ```

2. **Add Files from a Directory:**

   Load files from a directory into the zip object using the `fetch2zip` method:

   ```javascript
   const filesArray = [
     'file01.ext',
     'file02.ext',
     // additional files
   ];
   z.fetch2zip(filesArray, 'public/');
   ```

3. **Create a New File from a String:**

   Add a new file to the zip archive with content from a string using the `str2zip` method:

   ```javascript
   z.str2zip('test.txt', 'This is the content of the file.', 'public/test/');
   ```

4. **Upload Files via Input Element:**

   Allow users to upload files through an input element and add them to the zip archive:

   ```html
   <input type="file" onchange="z.files2zip(this.files)" multiple>
   ```

5. **Generate and Download the Zip File:**

   After adding all desired files, generate the zip archive and prompt the user to download it:

   ```javascript
   z.makeZip();
   ```

## Example

Here's a complete example demonstrating how to use Zip.js:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Zip.js Example</title>
  <script src="zip.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const z = new Zip('exampleZip');

      // Add files from a directory
      const filesArray = ['file01.txt', 'file02.txt'];
      z.fetch2zip(filesArray, 'public/');

      // Create a new file from a string
      z.str2zip('hello.txt', 'Hello, World!', 'docs/');

      // Handle file uploads
      document.getElementById('fileInput').addEventListener('change', function() {
        z.files2zip(this.files);
      });

      // Generate and download the zip file
      document.getElementById('downloadBtn').addEventListener('click', () => {
        z.makeZip();
      });
    });
  </script>
</head>
<body>
  <input type="file" id="fileInput" multiple>
  <button id="downloadBtn">Download Zip</button>
</body>
</html>
```

## License

This is free!

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## Acknowledgments

Special thanks to the contributors of this project.

## Contact

For any questions or suggestions, feel free to open an issue on the [GitHub repository](https://github.com/pwasystem/zip)
