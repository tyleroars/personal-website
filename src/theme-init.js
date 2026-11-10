(()=>{let theme;try{theme=localStorage.getItem('tyler-theme');}catch{}document.documentElement.dataset.theme=['light','dark'].includes(theme)?theme:'dark';})();
