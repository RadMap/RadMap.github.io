fetch("https://api.github.com/repos/RadMap/RadMap/releases/latest")
    .then((response) => {
        return response.json()
    }).then((result) => {
        document.getElementById("version").innerHTML = result.tag_name;
        document.getElementById("downloadUrl").href = result.assets[0].browser_download_url;
        console.log(result.tag_name)
        console.log(result.assets[0].browser_download_url)
    }).catch((error) => {
        console.log(error)
    })
   