const url = "https://sbi72z2kn8.execute-api.ap-northeast-1.amazonaws.com/prod"

$(function () {
    $.ajax({
        url: url,
        success: function (json) {
            var data = jsonRequest(json)
            initialize(data)
        },
    })

    function jsonRequest(json) {
        var data = []
        var n = json.length
        for (var i = 0; i < n; i++) {
            data.push(json[i])
        }
        return data
    }

    function attach_message(map, marker, name, konzatu, iw) {
        google.maps.event.addListener(marker, "click", function (e) {
            iw.setContent(`<span>${name}<br>混雑度：${konzatu}</span>`)
            iw.open(map, marker)
        })
    }

    function initialize(data) {
        var opts = {
            zoom: 15,
            center: new google.maps.LatLng(35.681382, 139.766084),
        }
        var map = new google.maps.Map(document.getElementById("map"), opts)
        var i = data.length
        var iw = new google.maps.InfoWindow()
        while (i-- > 0) {
            var dat = data[i]
            var obj = {
                position: new google.maps.LatLng(dat.ido, dat.keido),
                map: map,
            }
            var marker = new google.maps.Marker(obj)
            attach_message(map, marker, dat.name, dat.konzatu, iw)
            iw.close()
        }
    }
})

$(function () {
    $("#btn").click(function () {
        var button = $(this)
        button.attr("disabled", true)

        var data = {
            TableName: "intern-ag-shop",
            item: {
                name: {
                    S: $("#name").val(),
                },
                ido: {
                    S: $("#ido").val(),
                },
                keido: {
                    S: $("#keido").val(),
                },
                konzatu: {
                    S: $("#konzatu").val(),
                },
            },
        }

        console.log(data)
        $.ajax({
            type: "post",
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function () {
                console.log("success")
            },
            error: function () {
                console.log("error")
            },
            complete: function () {
                button.attr("disabled", false)
            },
        })
    })
})
