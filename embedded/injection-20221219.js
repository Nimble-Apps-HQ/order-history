(() => {
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  const apiLink = isLocal ? 'http://localhost:50339' : 'https://api-server-a2d7o3v32a-uc.a.run.app';
  const appId = document.querySelector('script[data-nim-order-history]').getAttribute('data-sitekey');
  sessionStorage.setItem('NIM_SS_APP_ID', appId);

  const xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.onreadystatechange = function() {
    if (xmlHttpRequest.readyState === XMLHttpRequest.DONE && xmlHttpRequest.status === 200) {
      const responseModel = JSON.parse(xmlHttpRequest.response);

      if (responseModel && responseModel.status === 'SUCCESS' && responseModel.data) {
        if (!responseModel.data.widgetEnabled) {
          console.log('Widget is not enabled. Kindly contact developer for support: ', responseModel.data.widgetEnabled);
          return;
        }

        const mountingPointId = responseModel.data.mountingPointId;

        const mountingPoint = document.createElement('div');
        mountingPoint.setAttribute('id', mountingPointId);
        mountingPoint.dataset.appId = appId;
        document.body.appendChild(mountingPoint);

        const version = responseModel.data.version;
        const injection = document.createElement('script');
        const cdnBasePath = 'https://cdn.jsdelivr.net/gh/Nimble-Apps-HQ/order-history-public/storefront';
        injection.src = (isLocal ? version : `${cdnBasePath}/${version}`) + '.js';
        injection.setAttribute('id', 'nm-order-history-script');
        injection.dataset.appId = appId;
        document.body.appendChild(injection);
      }
      else {
        console.log('No-Login Order History PRO experiencing technical issue. Please contact developer for support.');
      }
    }
  }

  xmlHttpRequest.open('GET', apiLink + '/api/storefront/version?appId=' + appId);
  xmlHttpRequest.send();
})();