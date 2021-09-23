function prettyDate(dateString) {
    //if it's already a date object and not a string you don't need this line:
    var date = new Date(dateString);
    var d = date.getDate();
    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var m = monthNames[date.getMonth()];
    var y = date.getFullYear();
    return d + " " + m + " " + y;
  }

  function removeCommas(str) {
    return str.replace(/,/g, "");
  }

  function randomNumbers() {
    const randomNumber1 = Math.floor(Math.random() * 9);
    const randomNumber2 = Math.floor(Math.random() * 9);
    const randomNumber3 = Math.floor(Math.random() * 9);
    const randomNumber4 = Math.floor(Math.random() * 9);
  
    return `00${randomNumber1}${randomNumber2}${randomNumber3}${randomNumber4}`;
  }