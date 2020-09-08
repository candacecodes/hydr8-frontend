document.addEventListener("DOMContentLoaded", (e) => {
  let success = false;
  while (!success) {
    success = login();
    return success;
  }
});

let user;

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
            let landingDiv = document.getElementById("profile-content");
            foundUser = user;
            return_value = true;
            landingDiv.innerText = `Login successful, welcome ${user.name}.`;

            renderProfile(foundUser); // loads user profile information
            findWaterCups(foundUser); // finds matching waterCups with userID
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

//signup function

const renderProfile = (user) => {
  console.log(user);
  let profile = document.getElementById("profile-content");
  let info = document.createElement("div");
  let editBtn = document.createElement("button");
  editBtn.innerText = "Edit Profile";
  profile.innerHTML = `Your Profile`;
  info.innerHTML = `
            <center>
             Name: ${user.name}<br>
             Age: ${user.age}<br>
             Gender: ${user.gender}<br>
             Water Goal: ${user.watergoal}<br>
            </center>
         `;
  profile.appendChild(info);
  info.appendChild(editBtn);

  info.addEventListener("click", (e) => editProfile(e, user));
};

const editProfile = (e, user) => {
  //   console.log(user);
  let profile = document.getElementById("profile-content");
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
const renderWaterCups = (user) => {
  document.querySelector(".content");
  //   console.log(user);
};

const findWaterCups = (user) => {
  fetch(`http://localhost:3000/water_cups`)
    .then((res) => res.json())
    .then((json) => {
      let div = document.querySelector(".content");
      div.innerHTML = "";
      let render = false;
      json.forEach((watercup) => {
        if (watercup.user_id == user.id) {
          fetch(`http://localhost:3000/water_cups/${watercup.id}`)
            .then((res) => res.json())
            .then((json) => {
              console.log(json);
              //   renderAppointments(json, user); // puts appts onto appointment list
            });
        }
      });
    });
};
