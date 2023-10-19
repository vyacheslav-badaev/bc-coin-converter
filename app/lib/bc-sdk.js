export function bigCommerceSDK() {
  if (typeof window === 'undefined') return;

  const s = 'script';
  const id = 'bigcommerce-sdk-js';
  const d = document;
  let js,
    bcjs = d.getElementsByTagName(s)[0];

  if (d.getElementById(id)) return;

  js = d.createElement(s);
  js.id = id;
  js.async = true;
  js.src = 'https://cdn.bigcommerce.com/jssdk/bc-sdk.js';
  bcjs?.parentNode?.insertBefore(js, bcjs);
  //@ts-ignore
  window.bcAsyncInit = function () {
    //@ts-ignore
    if (!window.Bigcommerce) return;
    //@ts-ignore
    window?.Bigcommerce?.init({
      onLogout: function () {
        fetch(`/api/logout`);
      },
    });
  };
}