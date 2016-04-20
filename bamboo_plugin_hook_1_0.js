// this module will allow for the Hook IO micro services to be used as the 
// interface mechanism for CA Release Automation CDE to interact with 
// Atlassian Bamboo.
//

module['exports'] = function runBambooBuild (hook) {
    // Read task inputs
    var request = require('request'),
        endPointProperties = hook.params.endPointProperties,
        bambooserver = endPointProperties.url,
        user = endPointProperties.user,
        password = endPointProperties.password,

        taskProperties = hook.req.body.taskProperties,
        planKey = taskProperties.planKey,
        newStatus = taskProperties.issueStatus;

    //authorization = authorization == "Trust me" ? hook.env.githubAuth : authorization;
    headers = {'Authorization': authorization, 'User-Agent': 'request'};
    requestBody = JSON.stringify({ "state" : newStatus });
    console.log("user["+user+"] repository["+repository+"] issueId["+issueId+"] will change to ["+newStatus+"]");

    // Update issuse using Bamboo REST API
    var url = 'repo'+'rest/api/latest';
    request.patch({'url':url, 'body':requestBody, 'headers':headers}, function(err, res, resBody){
        if (err) {
            return hook.res.end(err.messsage);
        }

        // Build response
        hook.res.setHeader("Content-Type", "application/json");
        hook.res.end(JSON.stringify({
            'externalTaskExecutionStatus' : 'FINISHED',
            'executionContext' : {},
            'taskState' : "Issue #"+issueId+" is "+newStatus,
            'detailedInfo': "Issue number "+issueId+" state is now "+newStatus,
            'progress' : 100,
            'delayTillNextPoll' : 0
        }));
    })
};
