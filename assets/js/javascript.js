var BTC = function(){
    var _delay;

    function init() {
        _delay = 30;
        initEventListeners();
        getData();
    }

    function initEventListeners() {
        $("#calculate").click(calculateCurrValue);
    }

    function getData() {
        $.get("https://api.coinbase.com/v2/prices/spot?currency=USD")
         .done(function(res) {
            $("#btc-current-price").text("$" + numberWithCommas(res.data.amount));
             if ($(".result").is(":visible")) {
                 updateResult(res);
             }
            poll();
         });
    }

    function calculateCurrValue(e) {
        e.preventDefault();
        $.get("https://api.coinbase.com/v2/prices/spot?currency=USD")
         .done(updateResult);
    }

    function poll() {
        setTimeout(function() {
            getData();
        }, _delay * 1000);
    }

    function updateResult(res) {
        var currUSD = (parseFloat($("#btc-amount").val()) * parseFloat(res.data.amount)).toFixed(2);
        var profit = (currUSD - parseFloat($("#usd-amount").val())).toFixed(2);

        $("#current-usd-value").text("$" + numberWithCommas(currUSD));
        $("#profit").text("$" + numberWithCommas(profit));

        if (profit < 0) {
            $("#profit").removeClass("positive");
            $("#profit").addClass("negative");
        } else {
            $("#profit").removeClass("negative");
            $("#profit").addClass("positive");
        }

        if ($(".result").is(":hidden")) {
            $(".result").show();
        }
    }

    function numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return {
        init: init
    }
}();

$(function() {
    BTC.init();
});