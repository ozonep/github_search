"use strict";

Handlebars.templates = Handlebars.templates || {};
var templates = document.querySelectorAll('template');
Array.prototype.slice.call(templates).forEach(function(tmpl) {
    Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
});

var usernameInput;
var username = ivan.username;
var password = ivan.password;

$("#button").on("click", function() {
    usernameInput = $("input[type='text']").val();
    $.ajax({
        url: 'https://api.github.com/users/' + usernameInput + '/repos',
        method: "GET",
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password)
        },
        success: function(data) {
            var myHtml = Handlebars.templates.repos({userRepos: data});
            $("main").html(myHtml);
        }
    });
});

$(document).on("click", ".container", function(e) {

    if ($(e.currentTarget).next().css("opacity") != 1) {
        $(e.currentTarget).next().addClass("active");
        if ($(e.currentTarget).next().html() == 0) {
            $.ajax({
                url: 'https://api.github.com/repos/' + $(e.currentTarget).find(".repoOwner").html() + '/' + $(e.currentTarget).find(".repoName").html() + '/commits',
                method: "GET",
                headers: {
                    Authorization: 'Basic ' + btoa(username + ':' + password)
                },
                success: function(data) {
                    var sliced = data.slice(0, 10);
                    console.log(e.currentTarget);
                    var commits = Handlebars.templates.idCommits({userCommits: sliced});
                    $(e.currentTarget).next().html(commits);
                }
            });
        }
    } else {
        $(e.currentTarget).next().removeClass("active");
    }
});



