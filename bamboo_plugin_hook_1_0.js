// this module will allow for the Hook IO micro services to be used as the 
// interface mechanism for CA Release Automation CDE to interact with 
// Atlassian Bamboo.
//

module['exports'] = function runBambooBuild (hook) {
    // Read task inputs
    var request = require('request'),
        endPointProperties = hook.req.body.endPointProperties,
        bambooserver = endPointProperties.url,
        user = endPointProperties.user,
        password = endPointProperties.password,

        taskProperties = hook.req.body.taskProperties,
        planKey = taskProperties.planKey;
        //newStatus = taskProperties.issueStatus;

    //authorization = authorization == "Trust me" ? hook.env.githubAuth : authorization;
    // need to create an encoded value.
    encodedUser = window.btoa(escape(endcodedURIComponent(user+password)));
    
    headers = {'Authorization': encodedUser, 'X-Atlassian-Token': 'nocheck'};
    //requestBody = JSON.stringify({ "state" : newStatus });
    //console.log("user["+user+"] repository["+repository+"] issueId["+issueId+"] will change to ["+newStatus+"]");
    console.log("user["+user+"] running new build based off Bamboo plan key["+plankey+"]");

    // Update issuse using Bamboo REST API
    url = 'bambooserver'+'rest/api/latest/queue/'+'planKey';
    //request.patch(
    request.post(
        //{'url':url, 'body':requestBody, 'headers':headers}, function(err, res, resBody)
        {'url':url, 'headers':headers}, function(err, res, resBody)
            {
                if (err) 
                {
                    return hook.res.end(err.messsage);
                }

        // Build response
        //hook.res.setHeader("Content-Type", "application/json");
        hook.res.setHeader("Content-Type", "application/xml");
        
        // now processing the response
        resBuild = "/s:restQueueBuild/buildResultKey";
        responseNode = XML.getNode(hook.resBody, resBuild);
        
        hook.res.end(JSON.stringify(
                    {
                        'bamboo build' : "+responseNode"
                    }
                )
            );
        
    }
)
};
