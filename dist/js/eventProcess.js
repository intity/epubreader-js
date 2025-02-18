// Xu ly su kien khi click vao bat cu vi tri nao tren man hinh ngoai tocList thi se dong muc luc
document.addEventListener("click", (e) => {
    const tocBtn = document.querySelector("#btn-t.box input");
    const tocList = document.querySelector("#toolbar-toc-list");

    if (tocList && !tocList.contains(e.target) && !tocBtn.contains(e.target)) {
        tocList.classList.remove("active");
    }
})

// Xy ly su kien khi click vao bat cu vi tri nao tren man hinh ngoai annotationsList thi se dong danh sach ghi chu
document.addEventListener("click", (e) => {
    const annotationBtn = document.querySelector("#btn-a.box input");
    const annotationList = document.querySelector("#toolbar-annotations-list");

    if (annotationList && !annotationList.contains(e.target) && !annotationBtn.contains(e.target)) {
        annotationList.classList.remove("active");
    }
})


// Xy ly su kien khi click vao bat cu vi tri nao tren man hinh ngoai bookmarkList thi se dong danh sach bookmark
document.addEventListener("click", (e) => {
    const bookmarkBtn = document.querySelector("#btn-d.box input");
    const bookmarkList = document.querySelector("#toolbar-bookmarks-list");

    if (bookmarkList && !bookmarkList.contains(e.target) && !bookmarkBtn.contains(e.target)) {
        bookmarkList.classList.remove("active");
    }
})
