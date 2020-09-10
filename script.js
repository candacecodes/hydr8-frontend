document.addEventListener("DOMContentLoaded", (e) => {
  document.getElementById("water-bottle-container").style.display = "none";
  document.getElementById("update-profile").style.display = "none";
  document.getElementById("d-drink-container").style.display = "none";
  document.getElementById("accordion").style.display = "none";

  // waterFacts();

  let success = false;
  while (!success) {
    success = login();
    return success;
  }
});
const addDrinkButton = (user) => {
  let waterBottleContainer = document.getElementById("water-bottle-container");
  let addDrinkBtn = document.createElement("button");
  addDrinkBtn.innerText = "Add Cup";
  addDrinkBtn.className = "btn btn-primary"; // can add this somewhere else
  waterBottleContainer.appendChild(addDrinkBtn);
  addDrinkBtn.addEventListener("click", (e) => addDrink(e, user));
};

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
            let page = document.querySelector(".update-profile");
            let landingDiv = document.createElement("div");
            landingDiv.className = "alert alert-success";
            page.appendChild(landingDiv);
            foundUser = user;
            return_value = true;
            landingDiv.innerHTML = "";
            landingDiv.innerHTML = `<div class="alert alert-primary" role="alert">
            <strong>Login Successful. Welcome to Hydr8, ${user.name}!</strong>
          </div>`;
           
            renderProfile(foundUser); // loads user profile information
            findWaterCups(foundUser); // finds matching waterCups with userID
            addDrinkButton(foundUser);
            toggleContent();
           
            hideProfileContent();
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

// sign up

const updateSignUpForm = () => {
  let div = document.getElementById("signup-content");
  div.innerHTML = "";
  div.innerHTML = "Sign up successful, please log in";
};

let signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);

  if (e.target.name.value === e.target.confirmname.value) {
    let data = {
      name: e.target.name.value,
      age: e.target.age.value,
      gender: e.target.gender.value,
      watergoal: 10,
    };
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });

    updateSignUpForm();
  }

  // } else {
  //   let error = document.getElementById("login-error");
  //   error.innerText = "";
  //   error.innerText = "Sorry, names do not match. Please try again.";
  //   signupForm.reset();
  // }
});

// this is to toggle / show waterbottle after user logs in
function toggleContent() {
  let x = document.getElementById("water-bottle-container");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

  // let signup = document.getElementById("profile-container");
  // if (signup.style.display === "none") {
  //   signup.style.display = "block";
  // } else {
  //   signup.style.display = "none";
  // }

  let updateprofile = document.getElementById("update-profile");
  if (updateprofile.style.display === "none") {
    updateprofile.style.display = "block";
  } else {
    updateprofile.style.display = "none";
  }

  let circle = document.getElementById("circle");
  circle.style.display = "none";

  let deleteContainer = document.getElementById("d-drink-container");
  if (deleteContainer.style.display === "none") {
    deleteContainer.style.display = "block";
  } else {
    deleteContainer.style.display = "none";
  }

  let facts = document.getElementById("accordion")
  if (facts.style.display === "none") {
    facts.style.display = "block";
  } else {
    facts.style.display = "none";
  }

}

// after sign in hide profile login
function hideProfileContent() {
  let x = document.getElementById("profile-container");
  x.style.display = "none";
}

//signup function

const renderProfile = (user) => {
  console.log(user);
  let waterBottleContainer = document.getElementById("water-bottle-container");
  let profile = document.getElementById("update-profile");
  let info = document.createElement("div");
  let editBtn = document.createElement("button");
  editBtn.className = "edit-button";

  waterGoal.innerHTML = `<center>Water Remaining: <br> ${user.watergoal} Cups </br><br></center>`;
  editBtn.innerText = "Edit Profile";
  profile.innerHTML = `Your Profile <hr> <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
  <br>
</svg>
 `;

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
  // waterBottleContainer.appendChild(addDrinkBtn);
  waterBottleContainer.prepend(waterGoal);

  info.addEventListener("click", (e) => editProfile(e, user));
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
  let x = document.querySelector(".delete-drink-container");
  let content = document.querySelector(".content"); // for waterbottle
  let div = document.createElement("div");
  let cup = document.createElement("p");
  let total = document.createElement("p");
  //   let addBtn = document.createElement("button");
  let deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-button";

  deleteBtn.innerHTML = ` Delete Cup <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg> `; // displays watercup amount
  //   total.innerText = "Watercup Total";

  cup.id = `${watercups.id}`; // id for watercup
  cup.appendChild(deleteBtn); // append delete button to specific cup
  x.appendChild(cup); // append watercup to div
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

// add event listener to delete button

// const findWaterCups = (user) => {
//   // fetch to find watercups
//   fetch(`http://localhost:3000/water_cups`)
//     .then((res) => res.json())
//     .then((json) => {
//       json.forEach((watercup) => {
//         find(watercup.user_id == user.id) { // find the first matching watercup
//           fetch(`http://localhost:3000/water_cups/${watercup.id}`, {
//   method: "DELETE",
//     });

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

const deleteDrinkWaterVisual = (user) => {
  // grab CSS property and increment .water[height] by ~10px each time
  let water = document.querySelector(".water");
  let height = water.offsetHeight;
  water.style.height = `${height + 19}px`;
  waterGoal.innerHTML = `<center>Water Remaining: ${(user.watergoal += 1)} Cups </br><br></center>`;
};


