$(document).ready(function(){
   
    // Display Data when Return From Any Website 

        var backButtonClicked = false;

        // Check if the popstate event is triggered (back/forward button)
        window.addEventListener('popstate', ()=> {
            // Set the flag to indicate that the back button was clicked
            backButtonClicked = true;

            // Handle the popstate event as needed
            // You may want to retrieve data from localStorage and update the page here
            var nestring = localStorage.getItem('userstring');
            if(nestring != null){
                displayUser(nestring);
                displayRepo(nestring);
            }
        });


    // Search Request To Github Api 
            const accessToken = "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";
            $('#SearchUser').keyup(function(){
                let searchval = $('#SearchUser').val();
                $.ajax({
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    url: 'https://api.github.com/users/' + searchval,
                    type: 'GET',
                    data: {
                        client_id: "df750985e8fc26fd5265",
                        client_secret: "7d8f1ad970c37b9335630f7ebd14336654b1a90e"
                    },
                    success: function(user){
                        // handle the success

                        const userstring = JSON.stringify(user);

                        // start localStorage
                        // Store the JSON string in localStorage
                        localStorage.setItem('userstring', userstring);

                        // Display user information
                        displayUser(userstring);
                        console.log(user);
                        // end localstorage 

                        let Querycontainer = $('#QueryContainer');
                        if(!user){
                            Querycontainer.html('<p>No Result</p>');
                        } else {
                            Querycontainer.html(`
                                <table class="table align-justify mb-0 bg-white">
                                    <tbody>
                                        <tr id="userRow">
                                            <td >
                                                <div class="d-flex align-items-justify">
                                                    <img src="${user.avatar_url}" alt="" style="width: 50px; height: 50px" class="rounded-circle" />
                                                    <div class="ms-3" style="padding-left: 20px;">
                                                        <p class="fw-bold" style="bottom: 0; margin: 0;">${user.name}</p>
                                                        <p class="text-muted">${user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p class="fw-normal mb-1" >${user.login}</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            `);
                            // Attach click event dynamically
                            $('#userRow').on('click', function() {
                                displayUser(userstring);
                                displayRepo(userstring);
                                $('#modalDialog').hide();
                            });
                        }
                    },
                    error: function(error){
                        // handle the error
                        console.log(error);
                    }
                });
            });


});




// Display User 
function displayUser(userString){
    const user = JSON.parse(userString);
    // console.log(user , "USeeeeee");
    $('.service-card').show();
    $('#userImage').attr('src', user.avatar_url);
    $('#userAvatar').attr('src', user.avatar_url);
    $('.card-title').attr('href' , user.html_url).text(user.name);
    $('.card-text').text(user.bio);
    $('#followers').attr('href' , user.followers_url).text('Followers');
    $('#following').attr('href' , user.following_url).text('Following');
    $('#gitrepo').attr('href' , user.repos_url);
    $('#userName').text(user.name);
    $('#useremail').text(user.email);
}


// Display Repo 
function displayRepo(userString){
    console.log("Working");
    const user = JSON.parse(userString);
    $.ajax({
        data: {
            client_id: "df750985e8fc26fd5265",
            client_secret: "7d8f1ad970c37b9335630f7ebd14336654b1a90e"
        },
        url: user.repos_url , 
        type: 'GET' ,
        success: function(response){
            // handle the success of repo url 
            console.log(response , "success Repo");
            console.log(response.length , "len");
            $('.repo-container').empty();
            for (var i=0 ; i < response.length ; i++){
                var repo = response[i]
                var desc = repo.description
                if(desc){
                    var words = desc.split(' ');
                    var shortenedDescription = words.slice(0, 30).join(' ') + ' ...';
                }else{
                    shortenedDescription = '';
                }

                    $('.repo-container').append(
                        `<div class="repo-card">
                    <header>
                        <div class="site-wrapper d-flex">
                            <h3 class="site-card-title"><a href="${repo.html_url}" >${repo.name}</a> </h3>
                            <p class="site-card-text">
                               ${repo.visibility}
                            </p>
                        </div>
                    </header>
                    <section>
                            <div class="repo-description-container">
                                <p> ${shortenedDescription}</p>
                            </div>
                    </section>
                    <footer> 
                        <div class="repo-lang-container" >
                        <div class="lang-wrapper">
                                <div class="lang">
                                    <p >  
                                        <span style="border-radius: 50%; background-color: red; height: 10px; width: 10px; display: inline-block;"></span>
                                        &nbsp;&nbsp;    ${repo.language}
                                    </p>
                                </div>
                        </div>
                        </div> 
                    </footer>
                </div>`
                    );   
            }
        },
        error: function(error){
            console.log(error) , "error Repo";
        }
    });
}



// Display The Search Modal 

    // Get the modal
    var modal = $('#modalDialog');

    // Get the button that opens the modal
    var btn = $("#mbtn");

    // Get the <span> element that closes the modal
    var span = $(".close");

    $(document).ready(function(){
        // When the user clicks the search button, open the modal 
        $('.search-btn').on('click', function() {
            $('#modalDialog').show();
        });

        // When the user clicks the button, open the modal 
        btn.on('click', function() {
            modal.show();
        });
        
        // When the user clicks on <span> (x), close the modal
        span.on('click', function() {
            modal.fadeOut();
        });
    });

    // When the user clicks anywhere outside of the modal, close it
    $('body').bind('click', function(e){
        if($(e.target).hasClass("modal")){
            modal.fadeOut();
        }
    });


