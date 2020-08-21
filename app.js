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
        var marker = new Array()

        for (var j = 0; j < i; j++) {
            var dat = data[j]
            var obj = {
                position: new google.maps.LatLng(dat.ido, dat.keido),
                map: map,
            }
            marker[j] = new google.maps.Marker(obj)
            attach_message(map, marker[j], dat.name, dat.konzatu, iw)
            iw.close()
        }

        var minX = marker[0].getPosition().lng()
        var minY = marker[0].getPosition().lat()
        var maxX = marker[0].getPosition().lng()
        var maxY = marker[0].getPosition().lat()

        for (var j = 0; j < i; j++) {
            var lt = marker[j].getPosition().lat()
            var lg = marker[j].getPosition().lng()
            if (lg <= minX) {
                minX = lg
            }
            if (lg > maxX) {
                maxX = lg
            }
            if (lt <= minY) {
                minY = lt
            }
            if (lt > maxY) {
                maxY = lt
            }
        }

        var sw = new google.maps.LatLng(maxY, minX)
        var ne = new google.maps.LatLng(minY, maxX)
        var bounds = new google.maps.LatLngBounds(sw, ne)
        map.fitBounds(bounds)
    }
})

$(function () {
    $("#btn").click(function () {
        var button = $(this)
        button.attr("disabled", true)
        var data = {
            TableName: "intern-ag-shop",
            Item: {
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
