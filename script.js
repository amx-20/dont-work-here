fetch("https://script.google.com/macros/s/AKfycbxoiZ1Toe9nYZvnCTE2tzuaB4kPUmLNJ5mlA_KLrxNh1Yq47WBOlTHmCvdexfndE5u4/exec")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });