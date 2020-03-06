// JavaScript source code
var host = "http://" + gateway.ip + ":" + gateway.port;

function is_logged() {
    let user = get_cookie("bj_user");
    let token = get_cookie("bj_token");
    if (user != "" && token != "")
        return [user, token];
    return false;
}
function get_cookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function set_cookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}
function destroy_cookie(cname) {
    document.cookie = cname + "=" + ";";
}
function logout() {
    destroy_cookie("bj_user");
    destroy_cookie("bj_token");
    window.location.reload();
}
function login() {
    let user = $("#bj_user").val();
    let pwd = $("#bj_pwd").val();
    let obj = { bj_user: user, bj_pwd: pwd };
    let exp = 15 * 0.000694444;
    $.ajax({
        type: 'POST',
        url: host + '/user/login',
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (data) {
            set_cookie("bj_user", user, exp);
            set_cookie("bj_token", data.key, exp);
            window.location.reload()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
                case 404:
                    $("#login-error").text("Incorrect username or password");
            }
        }
    });
}
function get_jobs(key) {
    let url = host + "/jobs";
    let jobs = {};
    $.ajax({
        url: url,
        headers: { 'Authorization': 'Bearer ' + get_cookie("bj_token") },
        success: function (data) {
            jobs = $.parseJSON(data);
            jobs.forEach(function (job) {
                console.log(job);
                let item = create("col_item", job);
                $("#joblist").append(item);
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
                case 404:
                    $("#col-error").text("No jobs found");
            }
        }
    });
}
function get_job(key, job_id) {
    let url = host + "/jobs/" + job_id;
    let job = {};
    $.ajax({
        url: url,
        headers: { 'Authorization': 'Bearer ' + get_cookie("bj_token") },
        success: function (data) {
            job = $.parseJSON(data);
            let body = create("body", job);
            $("#search-content").html(body);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
                case 404:
                    $("#search-error").text("No job found");
            }
        }
    });
}
function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}
function close_search() {
    $("#search-content").val("");
    $("#search-txt").val("");
}
function close_submit() {
    $("#dataset").val("");
    $("#model-code").val("");
    $("#job-title").val("");
    $("#framework").val("");
    $("#language").val("python");
    $("#datatype").val("csv");
}
function submit_job() {
    let key = get_cookie("bj_token");
    let job = {
        user_id: get_cookie("bj_user"),
        title: $("#job-title").val(),
        language: $("#language").val(),
        framework: $("#framework").val(),
        dataset: $("#dataset").val(),
        dataset_datatype: $("#datatype").val(),
        model: $("#model-code").val()
    }
    $.ajax({
        type: "POST",
        url: host + "/jobs",
        headers: { 'Authorization': 'Bearer ' + get_cookie("bj_token") },
        data: job,
        success: function () {
            window.location.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
                case 500:
                    $("#submit-error").text("An error occurred in submitting the job");
            }
        }
    });
}
function search_job() {
    if (isEmptyOrSpaces($("#search-txt").val()))
        $("#search-error").text("Type in a job id");
    else
    get_job(get_cookie("bj_token"), $("#search-txt").val());
}
function create_body(job) {
    let body = "<ul>" +
        "<li class='col-content'><span class='blue-text'>User id:\t</span>" + job.user_id + "</li>" +
        "<li class='col-content'><span class='blue-text'>Job id:\t</span>" + job.job_id + "</li>" +
        "<li class='col-content'><span class='blue-text'>Created at:\t</span>" + job.created_at + "</li>" +
        "<li class='col-content'><span class='blue-text'>Status:\t</span>" + job.status + "</li>" +
        "<li class='col-content truncate' style='width:100px;'><span class='blue-text'>Title:\t</span>" + job.title + "</li>" +
        "<li class='col-content'><span class='blue-text'>Language:\t</span>" + job.language + "</li>" +
        "<li class='col-content'><span class='blue-text'>Framework:\t</span>" + job.framework + "</li>" +
        "<li class='col-content'><span class='blue-text'>Datatype:\t</span>" + job.dataset_datatype + "</li>" +
        "<li class='col-content'><span class='blue-text'>Dataset:\n</span><textarea readonly class='materialize-textarea'>" + job.dataset + "</textarea></li>" +
        "<li class='col-content'><span class='blue-text'>Model:\n</span><textarea readonly class='materialize-textarea'>" + job.model + "</textarea></li>" +
        "</ul>";
    return body;
}
function create_col_item(job) {
    let body = create_body(job);
    let item = "<li>" +
        "<div class='collapsible-header'><ul>" +
        "<li class='col-header-field truncate'>" + job.job_id + "</li>" +
        "<li class='col-header-field col-head-title truncate'>" + job.title + "</li>"+
        "<li class='col-header-field truncate'>" + job.language + "</li>" +
        "<li class='col-header-field truncate'>" + job.framework + "</li>" +
        "<li class='col-header-field truncate'>" + job.created_at + "</li>" +
        "<li class='col-header-field truncate'>" + job.status +"</li>"+
        "</ul></div>" +
        "<div class='collapsible-body'><div>" + body + "</div></div>" +
        "</li>";
    return item;
}
function create_modal() {
    let modal =
        "<div id='modal' class='modal'>" +
        "<div class='modal-content'>" +
        "<h4>Create a new job</h4>" +
        "<br><label class='error' id='col-error'></label><br>" +
        "<label>Language</label>" +
        "<select id='language' class='browser-default'>" +
        "<option value= 'python' >Python</option>" +
        "<option value='java'>Java</option>" +
        "<option value='scala'>Scala</option>" +
        "<option value='c++'>C++</option>" +
        "<option value='julia'>Julia</option>" +
        "</select>" +
        "<label>Framework</label>" +
        "<select id='framework' class='browser-default'>" +
        "<option value= '' selected='selected'></option>" +
        "<option value='pytorch'>Pytorch</option>" +
        "<option value='caffe'>Caffe</option>" +
        "<option value='keras'>Keras</option>" +
        "<option value='tensorflow'>Tensorflow</option>" +
        "<option value='deeplearning4j'>Deeplearning4j</option>" +
        "<option value='apache_mahout'>Apache_mahout</option>" +
        "<option value='apache_singa'>Apache_singa</option>" +
        "</select>" +
        "<input type='text' placeholder='Title' id='job-title'>" +
        "<label>Datatype</label>" +
        "<select id='datatype' class='browser-default'>" +
        "<option value= 'csv'>CSV</option>" +
        "<option value='avro'>Avro</option>" +
        "<option value='JSON'>JSON</option>" +
        "</select>" +
        "<textarea id='dataset' placeholder='Dataset' class='materialize-textarea'></textarea>" +
        "<textarea id='model-code' placeholder='Model' class='materialize-textarea'></textarea>" +
        "</div>" +
        "<div class='modal-footer'>" +
        "<a href='#!' class='waves-effect waves-blue btn-flat' onclick='submit_job()'>Submit</a>" +
        "<a href='#!' class='modal-close waves-effect waves-blue btn-flat' onclick='close_submit()'>Cancel</a>" +
        "</div>" +
        "</div >" +
        "<div id='search' class='modal'>" +
        "<div class='modal-content'>" +
        "<h4>Search a job</h4>" +
        "<br><label class='error' id='search-error'></label><br>" +
        "<input type='text' id='search-txt' placeholder='Job id'><button class='btn-small waves-effect waves-light light-blue' type='button' onClick=search_job()>Go</button>" +
        "<div id='search-content'></div>" +
        "</div>" +
        "<div class='modal-footer'>" +
        "<a href='#!' class='modal-close waves-effect waves-blue btn-flat' onclick='close_search()'>Go back</a>" +
        "</div>";
    return modal;
}
function create_navbar() {
    let bar = "<ul class='right hide-on-med-and-down' id='topmenu'></ul>" +
        "<a href='#' data-target='mobile-links' class='sidenav-trigger'><i class='material-icons'>menu</i></a>" +
        "<ul id= 'mobile-links' class='sidenav'></ul>";
    return bar;
}
function create_login_form() {
    let form =
        "<div id='login_form_div' class='container'>" +
        "<div class='row' id='login_row'>" +
        "<form class='' id='login_form' >" +
        "<div class='row'>" +
        "<div class='input-field'>" +
        "<input placeholder='Username' id='bj_user' type='text' name='bj_user'>" +
        "</div>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='input-field'>" +
        "<input placeholder='Password' id='bj_pwd' type='password' name='bj_pwd'>" +
        "</div>" +
        "</div>" +
        "<button class='btn-large waves-effect waves-light light-blue' type='button' id='login_submit' onClick=login()>Login</button>" +
        "<br><label class='error' id='login-error'></label><br>"+
        "</form>" +
        "</div>" +
        "</div>";
    return form;
}
function create_search_bar() {
    let bar = "<center><ul class='list-inline'>" +
        "<li><a href='#search' class='btn-floating btn-large waves-effect waves-light blue modal-trigger'><i class='material-icons'>search</i></a><br><label>Search job</label></li>" +
        "<li><a href='#modal' class='btn-floating btn-large waves-effect waves-light blue modal-trigger'><i class='material-icons'>add</i></a><br><label>Submit job</label></li>" +
        "</ul></center>";
    return bar;
}
function create(what, job) {
    switch (what) {
        case "body":
            return create_body(job);
        case "col_item":
            return create_col_item(job);
        case "modal":
            return create_modal();
        case "navbar":
            return create_navbar();
        case "login_form":
            return create_login_form();
        case "search_bar":
            return create_search_bar();
    }
}

$(document).ready(function () {
    let is = is_logged();
    if (is != false) {
        $("#wc").append(create("navbar", ""));

        $("#topmenu").append("<li><label style='color:white'>You're logged as " + is[0] + "</label></li>");
        $("#topmenu").append("<li><a href='#' onClick='logout()'>Log out</a></li>");

        $("#mobile-links").append("<li><a href='#' style='color:black;pointer-events: none;'>You're logged as " + is[0] + "</a></li>");
        $("#mobile-links").append("<li><a href='#' onClick='logout()'>Log out</a></li>");

        $("body").append(create("search_bar", ""));
        $("body").append(create("modal", ""));
        $("body").append("<ul class='collapsible' id='joblist'></ul>");

        get_jobs(get_cookie("bj_token"));
    }
    else {
        $("body").append(create("login_form", ""));
    }
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    $('.modal').modal();
});
