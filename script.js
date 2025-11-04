/*
 * 開啟側邊選單
 */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/*
 * 關閉側邊選單
 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

/* 處理下拉式選單 */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}