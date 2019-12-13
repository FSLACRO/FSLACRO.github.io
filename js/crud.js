var ORDERS_API = 'https://l87f6pawcf.execute-api.us-east-1.amazonaws.com/production/api/plans';
let contentTable = document.querySelector('.contentTable');
let loader = document.querySelector('.loader');
let createUpdate = document.querySelector('.createUpdate');
let main = document.querySelector('.main');
let isUpdate = false;

let createUpdateForm = document.getElementById('createUpdateForm');
let _id = document.getElementById('_id');
let name = document.getElementById('name');
let rate = document.getElementById('rate');
let per = document.getElementById('per');
let n_per = document.getElementById('nPer');
let down_payment = document.getElementById('downPayment');
let residual_payment = document.getElementById('residualPayment');
let grace_per = document.getElementById('gracePer');
let image_url = document.getElementById('imageUrl');

window.addEventListener('load', () => {
  fetchPlans();
});

function hideSpinner() {
  if (loader.style.display === 'none') {
    loader.style.display = 'block';
  } else {
    loader.style.display = 'none';
    createUpdate.style.display = 'none';
  }
}

function showCreatePlan() {
  main.style.display = 'none';
  createUpdate.style.display = 'block';
  clearInputs();
  isUpdate = false;
}

function fetchPlans() {
  loader.style.display = 'block';
  fetch(`${ORDERS_API}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(response => {
      if (response.data) {
        printTable(response.data);
      } else {
        loader.style.display = 'none';
      }
    })
    .catch(error => alert(`HTTP-Error: ${error}`));
}

function printTable(data) {
  contentTable.innerHTML = '';
  let index = 1;
  data.map(item => {
    contentTable.innerHTML += `
    <tr>
      <td>${index}</td>
      <td>${item.name}</td>
      <td>${item.rate}</td>
      <td>${item.per}</td>
      <td>${item.n_per}</td>
      <td>${item.down_payment}</td>
      <td>${item.residual_payment}</td>
      <td>${item.grace_per}</td>
      <td>${item.image_url}</td>
      <td>
        <button onclick="planById('${item._id}')" class="btn">Edit</button>
      </td>
      <td>
        <button id="btn_${item._id}" onclick="toggleState('${item._id}', ${
      item.active
    });" class="btn">
        ${item.active == true ? 'Enable' : 'Disable'}
        </button>
      </td>
    </tr>
    `;
    index++;
  });
  loader.style.display = 'none';
}

function toggleState(id, state) {
  loader.style.display = 'block';
  fetch(`${ORDERS_API}/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      active: !state
    })
  })
    .then(response => response.json())
    .then(response => {
      let btn = document.getElementById(`btn_${id}`);
      btn.setAttribute('onClick', `toggleState('${id}', ${!state})`);
      btn.textContent = !state == true ? 'Enable' : 'Disable';
      fetchMessage(response);
    })
    .catch(error => alert(`HTTP-Error: ${error}`));
  loader.style.display = 'none';
}

function planById(id) {
  loader.style.display = 'block';
  fetch(`${ORDERS_API}?_id=${id}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(response => {
      if (response.data) {
        main.style.display = 'none';
        createUpdate.style.display = 'block';
        const data = response.data[0];
        _id.value = data._id;
        name.value = data.name;
        rate.value = data.rate;
        per.value = data.per;
        n_per.value = data.n_per;
        down_payment.value = data.down_payment;
        residual_payment.value = data.residual_payment;
        grace_per.value = data.grace_per;
        image_url.value = data.image_url;
        isUpdate = true;
      }
    })
    .catch(error => alert(`HTTP-Error: ${error}`));
  loader.style.display = 'none';
}

function save() {
  if (confirm('Are you sure you submit?')) {
    submit();
  }
}

createUpdateForm.onsubmit = function (event) {
  event.preventDefault();
  const formData = dataForm();
  if (confirm('Are you sure you submit?')) {
    loader.style.display = 'block';
    if (!isUpdate) {
      fetch(`${ORDERS_API}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(response => {
          updateView();
          fetchMessage(response);
        })
        .catch(error => alert(`HTTP-Error: ${error}`));
    } else {
      fetch(`${ORDERS_API}/${_id.value}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(response => {
          updateView();
          fetchMessage(response);
        })
        .catch(error => {
          loader.style.display = 'none';
          alert('HTTP-Error:' + error);
        });
    }
  }
}

function isInt(evt) {
  let charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
}

function isFloat(evt, id) {
  let charCode = evt.which ? evt.which : event.keyCode;
  if (charCode == 46) {
    let txt = document.getElementById(id).value;
    if (!(txt.indexOf('.') > -1)) {
      return true;
    }
  }
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
}

function dataForm() {
  return {
    name: name.value,
    rate: Number(rate.value),
    per: Number(per.value),
    n_per: Number(n_per.value),
    down_payment: Number(down_payment.value),
    residual_payment: Number(residual_payment.value),
    grace_per: Number(grace_per.value),
    image_url: image_url.value
  };
}

function clearInputs() {
  _id.value = '';
  name.value = '';
  rate.value = '';
  per.value = '';
  n_per.value = '';
  down_payment.value = '';
  residual_payment.value = '';
  grace_per.value = '';
  image_url.value = '';
}

function fetchMessage(json) {
  if (json.message) {
    alert(json.message);
  } else {
    alert(json.error);
  }
}

function updateView() {
  createUpdate.style.display = 'none';
  main.style.display = 'block';
  loader.style.display = 'none';
  fetchPlans();
}

function showTable() {
  createUpdate.style.display = 'none';
  main.style.display = 'block';
}
