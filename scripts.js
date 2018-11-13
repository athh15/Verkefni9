// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }

  function createEl(dl, name, value) {
    const tempEl = document.createElement('dt');
    tempEl.appendChild(document.createTextNode(name));

    const tempValueEl = document.createElement('dd');
    tempValueEl.appendChild(document.createTextNode(value));

    dl.appendChild(tempEl);
    dl.appendChild(tempValueEl);
  }

  function displayDomain(dom) {
    if (dom.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }

    const [{
      domain,
      registered,
      lastChange,
      expires,
      registrantname,
      email,
      address,
      country
    }] = dom;

    const dl = document.createElement('dl');

    const registeredDATE = new Date(registered).toISOString().split('T')[0];
    const lastChangeDATE = new Date(lastChange).toISOString().split('T')[0];
    const expiresDATE = new Date(expires).toISOString().split('T')[0];

    createEl(dl, 'Lén', domain);
    createEl(dl, 'Skráð', registeredDATE);
    createEl(dl, 'Seinast breytt', lastChangeDATE);
    createEl(dl, 'Rennur út', expiresDATE);
    if (registrantname !== '') {
      createEl(dl, 'Skráningaraðili', registrantname);
    }
    if (email !== '') {
      createEl(dl, 'Netfang', email);
    }
    if (address !== '') {
      createEl(dl, 'Heimilsfang', address);
    }
    if (country !== '') {
      createEl(dl, 'Land', country);
    }

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dl);
  }

  function displayLoading() {
    const container = domains.querySelector('.results');
    const img = document.createElement('img');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    img.src = 'loading.gif';
    container.appendChild(img);
    container.appendChild(document.createTextNode('Leita að léni...'));
  }

  function fetchData(URL) {
    displayLoading();
    fetch(`${API_URL}${URL}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa við að sækja gögn');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch(() => {
        displayError('Villa');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

    if (input.value.trim() === '') {
      displayError('Lén verður að vera strengur!');
    } else {
      fetchData(input.value);
    }
  }

  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);

  }
  return {
    init,
  };
})();


document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});