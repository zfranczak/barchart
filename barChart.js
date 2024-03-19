document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('getMessage').onclick = function () {
    fetch(
      'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
      });
  };
});
