import fetchJsonp from "fetch-jsonp"

export default async(type = 'GET', url = '', data = {}, method = 'fetch') => {
    type = type.toUpperCase();
    if (type == 'GET') {
        let dataStr = ''; //数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    if (window.fetch && method == 'fetch') {
        let requestConfig = {
            credentials: 'include',
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: "cors",
            cache: "force-cache"
        }

        if (type == 'POST') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }

        try {
            var response = await fetch(url, requestConfig);
            var responseJson = await response.json();
        } catch (error) {
            throw new Error(error)
        }
        return responseJson
    } else if (fetchJsonp && method == 'fetchJsonp') {
        try {
            var response = await fetchJsonp(url);
            var responseJson = await response.json();
        } catch (error) {
            throw new Error(error)
        }
        return responseJson
    } else {
        let requestObj;
        if (window.XMLHttpRequest) {
            requestObj = new XMLHttpRequest();
        } else {
            requestObj = new ActiveXObject;
        }

        let sendData = '';
        if (type == 'POST') {
            sendData = JSON.stringify(data);
        }

        requestObj.open(type, url, true);
        requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        requestObj.send(sendData);
        requestObj.onreadystatechange = () => {
            if (requestObj.readyState == 4) {
                if (requestObj.status == 200) {
                    let obj = requestObj.response
                    if (typeof obj !== 'object') {
                        obj = JSON.parse(obj);
                    }
                    return obj
                } else {
                    throw new Error(requestObj)
                }
            }
        }
    }
}




    // import fetch from 'dep/service';
     // var getList = () => fetch('GET','https://api-mall.etcchebao.com/goods/detail', {
     //        token: token,
     //        id: id
     //    },'fetchJsonp');


     //    // 获取当前城市
     //    getList(token,id).then(res => {
     //       console.log(res);
     //    })