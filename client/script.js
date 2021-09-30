let fileUpload = document.querySelector(".container .file-uploading-area .upload-file");
let selectFile = document.getElementById("id-upload-file-option");
let fileUploadingArea = document.querySelector(".container .file-uploading-area");
let uploadBtn = document.getElementById("id-submit-file-btn");
let fileUploadedArea = document.getElementById("id-files-uploaded-area");


let fileName,fileSize,fileSizeUploaded,fileURL,fileInfo;
// Opens the file explorer for selecting a file
selectFile.addEventListener("click",function (e){
    fileUpload.click();
    
})

/*
    Runs when file selection element changes 
    and this will disable the selection element 
    from showing and display file name and size 
*/
fileUpload.addEventListener("change",function (e){
    console.log(e);
    fileName = e.target.files[0].name;
    let fileSizeInBytes = e.target.files[0].size;
    
    
    if(fileSizeInBytes<1048576) {
        fileSize = Math.fround(fileSizeInBytes/1024).toFixed(2) + "KB";
    } else {
        fileSize = Math.fround(fileSizeInBytes/1048576).toFixed(2) + "MB";
    }


    fileInfo = document.createElement("div");
    fileInfo.className = "uploading-file-info";
    fileInfo.innerHTML = `${fileName}  ${fileSize}`;
    selectFile.style.display = "none";
    
    fileUploadingArea.appendChild(fileInfo);
    console.log(fileName,fileSize);
})



// Creates element for showing "Uploading • x%"
let progressBar = document.createElement("div");
progressBar.className = "file-progress-bar";


/* 
    When user clicks the upload btn, this will invoke
    and starts uploading to the server and while uploading
    to the server it starts updating the progress and after
    completion of the uploading, this will display the select
    option and delete the progressbar and also file info element.

    It will also create a new element of file-info in the 
    uploaded files div element
*/
uploadBtn.addEventListener("click",function(e){
    fileUploadingArea.appendChild(progressBar);


    let uploadForm = new FormData(document.getElementById("id-file-form"));
    let xhr = new XMLHttpRequest();
    if(xhr.upload){

        xhr.upload.onprogress = function (e){
            fileSizeUploaded = (e.loaded || e.position)/(1024*1024);
            let fileTotalSize = (e.total || e.totalSize)/(1024*1024);
            let percentage = ((fileSizeUploaded/fileTotalSize)*100).toFixed(2);

            console.log(`${(fileSizeUploaded).toFixed(2)}MB/${fileTotalSize.toFixed(2)} === ${percentage}%`);
            uploadBtn.style.display = "none";
            progressBar.remove();
            progressBar.innerHTML = `Uploading • ${percentage}%`;
            fileUploadingArea.appendChild(progressBar);
        }
    }
    xhr.onreadystatechange = function (e){
        if(4 === this.readyState) {
            progressBar.remove();
            fileInfo.remove();
            uploadBtn.style.display = "unset";
            selectFile.style.display = "unset";


            let serverResponse = JSON.parse(xhr.response);
            fileURL = serverResponse.url;


            let filesElement = document.createElement("div");
            filesElement.className = "file-info";
            filesElement.innerHTML = `<div class="file-logo"><img src="./file-icon.svg" width="35em" height="35em" alt="file logo" /></div>
                                        <span>
                                            <div class="file-name">${fileName}</div>
                                            <div class="file-size">${fileSize}</div>
                                        </span>
                                        <div class="copy-link-svg" ><img class=${fileURL} onclick="copyLink(this.getAttribute('class'))" src="./copy-link-icon.svg" width="35em" height="35em" alt="copy link"></div>
                                        `
            fileUploadedArea.appendChild(filesElement);

        }
    }
    xhr.open("POST","http://192.168.0.108:3000/upload",true);
    // xhr.setRequestHeader("Content-Type","multipart/form-data");
    xhr.send(uploadForm);

})








