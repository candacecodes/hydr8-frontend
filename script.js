document.addEventListener("DOMContentLoaded", (e) => {
  let success = false;
  while (!success) {
    success = login();
    return success;
  }
});

let user;

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
            let landingDiv = document.getElementById("profile");
            foundUser = user;
            return_value = true;
            landingDiv.innerText = `Login successful, welcome ${user.name}.`;

            renderWaterCups(foundUser); // finds matching waterCups with userID
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

const renderWaterCups = (e) => {
  console.log(e);
  let profile = document.getElementById("profile");
  let info = document.createElement("div");
  let submitBtn = document.createElement("button");
  info.innerHTML = `
            <center>
             Name: ${e.name}<br>
             Age: ${e.age}<br>
             Gender: ${e.gender}<br>
             Water Goal: ${e.watergoal}<br>
            </center>
         `;
  profile.appendChild(info);
  info.appendChild(submitBtn);

  info.addEventListener("submit", (e) => editProfile(e));
};

const editProfile = (e) => {
    console.log(e)

    // <div class="updateprofile" id="updateprofileinfo">
    // <center>
    //   <h4 id="name">Update Profile</h4>
    //     <label for="fdate">Name:</label> 
    //     <input type="text" id="fdate" name="fdate" value="">
    //     <br>
        
    //     <label for="fage">Age: </label>
    //     <select id="fage" name="fage" value=""></select>
    //     <br>

    //     <label for="fgender">Gender: </label>
    //     <select id="fgender" name="fgender" value=""></select>
    //     <br>

    //     <label for="fwatergoal">Water Goal: </label>
    //     <select id="fwatergoal" id="fwatergoal" name="fwatergoal" value="">
    //     <br>

        
    //     <input id="submit" class="btn btn-primary disabled" type="submit" value="Submit">
        
    //   </form> </center><br><br>
    //     </div>
    //   </div>


}
