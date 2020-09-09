document.addEventListener("DOMContentLoaded", (e) => {
  document.getElementById("water-bottle-container").style.display = "none";

  let success = false;
  while (!success) {
    success = login();
    return success;
  }
});

let user;
let waterGoal = document.createElement("h1");
waterGoal.className = "remainder-header";
waterGoal.id = "waterRemainder";

// login function
const login = () => {
  let return_value = false;
  let loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((json) => {
        let foundUser;

        json.forEach((user) => {
          if (user.name === e.target[0].value) {
            let page = document.querySelector(".content")
            let landingDiv = document.createElement("div");
            landingDiv.className = "alert alert-success alert-dismissible fade show"
            page.appendChild(landingDiv)
            foundUser = user;
            return_value = true;
            landingDiv.innerHTML = '';
            landingDiv.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Login Successful, Welcome, ${user.name}!</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`;

            renderProfile(foundUser); // loads user profile information
            findWaterCups(foundUser); // finds matching waterCups with userID
            toggleContent();
          }
        });
        if (!foundUser) {
          let error = document.getElementById("login-error");
          error.innerText = "";
          error.innerText =
            "Sorry, name is not found. Please try again or sign up.";
          loginForm.reset();
        }
      });
  });
};
// this is to toggle / show waterbottle after user logs in
function toggleContent() {
  let x = document.getElementById("water-bottle-container");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
//signup function

const renderProfile = (user) => {
  console.log(user);
  let waterBottleContainer = document.getElementById("water-bottle-container");
  let profile = document.getElementById("update-profile");
  let info = document.createElement("div");
  let editBtn = document.createElement("button");
  let addDrinkBtn = document.createElement("button");
  addDrinkBtn.className = "btn btn-primary"; // can add this somewhere else

  waterGoal.innerHTML = `<center>Water Remaining: <br> ${user.watergoal} Cups </br><br></center>`;
  editBtn.innerText = "Edit Profile";
  profile.innerHTML = `Your Profile`;
  addDrinkBtn.innerText = "Add drink";
  info.innerHTML = `
            <center>
             Name: ${user.name}<br>
             Age: ${user.age}<br>
             Gender: ${user.gender}<br>
             Water Goal: ${user.watergoal}<br>
            </center>
         `;
  profile.appendChild(info); // append info profile header div
  info.appendChild(editBtn);
  waterBottleContainer.appendChild(addDrinkBtn);
  waterBottleContainer.prepend(waterGoal);

  info.addEventListener("click", (e) => editProfile(e, user));
  addDrinkBtn.addEventListener("click", (e) => addDrink(e, user)); // can move this elsewhere with btn
};

const editProfile = (e, user) => {
  //   console.log(user);
  let profile = document.getElementById("update-profile");
  let info = document.createElement("form");
  let editBtn = document.createElement("button");
  editBtn.innerText = "Submit Update";
  profile.innerText = "Update Profile";
  //   info.innerHTML = ``;

  info.innerHTML = `
      <label for="fname">Name:</label> 
      <input type="text" id="fname" name="fname" value="">
      <br>
      
      <label for="fage">Age (Int): </label>
      <input type="text" id="fage" name="fage" value=""></select>
      <br>

      <label for="fgender">Gender: </label>
      <input type="text" id="fgender" name="fgender" value=""></select>
      <br>

      <label for="fwatergoal">Water Goal (Int): </label>
      <input type="text" id="fwatergoal" id="fwatergoal" name="fwatergoal" value="">
      <br><br>

      <input id="submit" class="btn btn-primary disabled" type="submit" value="Submit">
      
    </form>`;

  profile.appendChild(info);
  //   let submit = document.getElementById("submit");
  info.addEventListener("submit", (e) => updateProfile(e, user));
};

const updateProfile = (e, user) => {
  e.preventDefault();
  //   console.log(user);

  let data = {
    name: e.target.fname.value,
    age: e.target.fage.value,
    gender: e.target.fgender.value,
    watergoal: e.target.fwatergoal.value,
  };

  fetch(`http://localhost:3000/users/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((json) => renderProfile(json));
};

// WaterCup Info

const findWaterCups = (user) => {
  // fetch to find watercups
  fetch(`http://localhost:3000/water_cups`)
    .then((res) => res.json())
    .then((json) => {
      let div = document.querySelector(".content");
      //   div.innerHTML = "";
      //   let render = false;
      json.forEach((watercup) => {
        if (watercup.user_id == user.id) {
          fetch(`http://localhost:3000/water_cups/${watercup.id}`)
            .then((res) => res.json())
            .then((json) => {
              renderWaterCups(json);
              //   renderAppointments(json, user); // puts appts onto appointment list
            });
        }
      });
    });
};

const renderWaterCups = (watercups, user) => {
  // for each watercup
  //   console.log(watercups);
  // render watercups onto DOM
  // need to change .content in html to a better location to append stuff
  let x = document.getElementById("water-bottle-container");
  let content = document.querySelector(".content"); // for waterbottle
  let div = document.createElement("div");
  let cup = document.createElement("p");
  let total = document.createElement("p");
  //   let addBtn = document.createElement("button");
  let deleteBtn = document.createElement("button");

  deleteBtn.innerText = "Delete Drink";
  //   total.innerText = "Watercup Total";

  cup.innerHTML = `${watercups.amount}`; // displays watercup amount
  cup.id = `${watercups.id}`; // id for watercup
  cup.appendChild(deleteBtn); // append delete button to specific cup
  div.appendChild(cup); // append watercup to div
  //   div.appendChild(total);
  x.appendChild(div); // append div to .content class

  deleteBtn.addEventListener("click", (e) => deleteDrink(e, watercups, user));
};

const deleteDrink = (e, watercups, user) => {
  // backend for delete drink
  fetch(`http://localhost:3000/water_cups/${watercups.id}`, {
    method: "DELETE",
  }).then((res) => {
    let deleteThisWaterCup = document.getElementById(`${watercups.id}`);
    deleteThisWaterCup.innerText = "";
    // deleteThisWaterCup.innerText = "deleted watercup";
  });

  deleteDrinkWaterVisual();
};

const addDrink = (e, user) => {
  //backend for add drink
  addDrinkWaterVisual();

  decreaseWaterGoal(user);

  let data = {
    amount: 1,
    user_id: user.id,
  };

  fetch(`http://localhost:3000/water_cups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((json) => renderWaterCups(json));
};

const decreaseWaterGoal = (user) => {
  if (waterGoal.innerText.includes(" 0")) {
    waterGoal.innerText = "Water Goal Met";
  } else {
    waterGoal.innerHTML = `<center>Water Remaining: ${(user.watergoal -= 1)} Cups </br><br></center>`;
  }
};

const addDrinkWaterVisual = () => {
  // grab CSS property and increment .water[height] by ~10px each time
  let water = document.querySelector(".water");
  let height = water.offsetHeight;
  water.style.height = `${height - 19}px`;
};

const deleteDrinkWaterVisual = () => {
  // grab CSS property and increment .water[height] by ~10px each time
  let water = document.querySelector(".water");
  let height = water.offsetHeight;
  water.style.height = `${height + 19}px`;
};
