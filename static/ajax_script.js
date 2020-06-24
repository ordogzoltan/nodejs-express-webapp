// eslint-disable-next-line no-unused-vars
function tantargyDetail(id) {
  fetch(`/tantargyLeiras_${id}`)
    .then((errorcheck) => {
      if (!errorcheck.ok) {
        document.getElementById(`leiras_${id}`).innerText = 'HIBA!!';
        throw new Error('HIBA');
      } else {
        return errorcheck;
      }
    })
    .then((response) => response.json())
    .then((message) => {  // 2. promise - szöveg használata
      document.getElementById(`dfull_${id}`).focus();
      console.log(`ajax message: ${message[0].leiras}`);
      document.getElementById(`leiras_${id}`).innerText = `Leiras: ${message[0].leiras}`;
    })
    .catch((error) => console.log(error));
}

// eslint-disable-next-line no-unused-vars
function feladatTorles(id) {
  console.log(`feladatTorles: ${id}`);

  fetch('/feladatTorles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fid: id,
    }),
  })
    .then((response) => response.json())
    .then((error) => {
      // eslint-disable-next-line eqeqeq
      if (!error.error == 'HIBA') {
        document.getElementById(id).innerText = 'HIBA!!';
        throw new Error('Not deleted!!');
      } else { return error.uzenet; }
    })
    .then((message) => {
      console.log(message);
      document.getElementById(id).innerText = 'Sikeresen torolve!!';
      document.getElementById(id).style.background = 'green';
      document.getElementById(id).style.color = 'white';
      document.getElementById(id).disabled = true;
    })
    .catch((error) => console.log(error));
}
