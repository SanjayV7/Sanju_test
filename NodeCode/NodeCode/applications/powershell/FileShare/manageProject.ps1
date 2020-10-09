param(
    [Parameter(Mandatory=$True, Position=1, ValueFromPipeline=$false, HelpMessage="Enter project name")]
    [System.String]
    $projectId,
    [Parameter(Mandatory=$True, Position=1, ValueFromPipeline=$True, HelpMessage="Enter list of apps")]
    [System.String[]]
    $apps,
    [Parameter(Mandatory=$True, Position=1, ValueFromPipeline=$false, HelpMessage="Enter action")]
    [System.String]
    $action,
    [Parameter(Mandatory=$True, Position=1, ValueFromPipeline=$false, HelpMessage="Enter action")]
    [System.String]
    $file

)

$projectName = 'PRJ' + $projectId
#Read JSON File for SG Details
$fileContent = Get-Content $file | ConvertFrom-Json

#DFTE Project Location Path (Windows Shared Drive Path)
$projectPath = $fileContent.projectPath

function createFolders {
    #$apps = @('DCON','DTEST','DPERF','DPLOY','DMON','TALOS','DREC','DCLEAN','DPOC','DSPEC','DTRAIN','DGEN','DEX','DCODE','DROLE','DFTE-PLATFORM-TECH')
    $folderList = @('IN','OUT','ARCHIVE','ERROR')

    $gitFolder = @('DPLOY')

    $screenShotFolder = @('DCON', 'DTRAIN')

    $moduleFolder = @('DGEN')
    $modlueFolderList = @('GL', 'AP', 'PO', 'Supplier')
    
    foreach($folder in $apps){
    
        $folderList | ForEach-Object {New-Item -Path $projectPath\$projectName\$folder\$_ -ItemType 'Directory'}
    
        if ($folder -in $screenShotFolder){
            'SCREENSHOT' | ForEach-Object {New-Item -Path $projectPath\$projectName\$folder\$_ -ItemType 'Directory'}
        }
    
        if ($folder -in $moduleFolder){
            $modlueFolderList | ForEach-Object {New-Item -Path $projectPath\$projectName\$folder\IN\$_ -ItemType 'Directory'}
        }
        if ($folder -in $gitFolder) {
            'GIT','SVN' | ForEach-Object {New-Item -Path $projectPath\$projectName\$folder\$_ -ItemType 'Directory'}
        }
    }
}

function deleteFolders {
    $apps | ForEach-Object {Remove-Item -Path $projectPath\$projectName\$_ -Recurse}
    if((Get-ChildItem $projectPath\$projectName).count -eq 0){
        Remove-Item -Path $projectPath\$projectName -Recurse
    }

}

function provideAccessSysAcc {
    param (
        [System.String]$user
    )

    $userArr = $user.Split(",")
    $relpath = $projectPath + '\' + $projectName

    $filesystemrights = 'Modify'
    $inherit          = 'ContainerInherit,ObjectInherit'
    $propogation      = 'None'

    for($i = 0; $i -lt $userArr.length; $i++) {
        $users = 'US\' + $userArr[$i]

        Write-Host("Providing permissions for $($users) for path - $($relpath)")

        $acl = Get-Acl $relpath
        $AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($users, $filesystemrights, $inherit, $propogation,'Allow')

        $acl.SetAccessRule($AccessRule)

        $acl | Set-Acl $relpath
    }
    
}

function provideAccessParent {
    param (
        [System.String]$user,
        [System.String]$userRole
    )
    $relpath = $projectPath + '\' + $projectName

    $filesystemrights = 'Read'
    $inherit          = 'ContainerInherit,ObjectInherit'
    $propogation      = 'None'
    
    $user = 'US\' + $user + $projectId

    Write-Host("Providing permissions for $($user) for path - $($relpath)")

    $acl = Get-Acl $relpath
    $AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($user, $filesystemrights, $inherit, $propogation,'Allow')

    $acl.SetAccessRule($AccessRule)

    $acl | Set-Acl $relpath
}

function provideAccessDFTE {
    param (
        [System.String]$user,
        [System.String]$relpath
    )

    $filesystemrights = 'Read'
    $inherit          = 'ContainerInherit,ObjectInherit'
    $propogation      = 'None'
    
    Write-Host("Providing permissions for $($user) for path - $($relpath)")

    $acl = Get-Acl $relpath
    $AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($user, $filesystemrights, $inherit, $propogation,'Allow')

    $acl.SetAccessRule($AccessRule)

    $acl | Set-Acl $relpath
}

function provideAccessDFTEChild {
    param (
        [System.String]$user,
        [System.String]$appPath
    )
    
        $filesystemrights = 'Read,Write,DeleteSubdirectoriesAndFiles'
        $inherit          = 'ContainerInherit,ObjectInherit'
        $propogation      = 'None'

    Write-Host("Providing permissions for $($user) for path - $($appPath)")

    $acl = Get-Acl $appPath
    $AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($user, $filesystemrights, $inherit, $propogation,'Allow')

    $acl.AddAccessRule($AccessRule)

    $acl | Set-Acl $appPath
}

function provideAccessChild {
    param (
        [System.String]$user,
        [System.String]$appPath
    )
    
        $filesystemrights = 'Read,Write,DeleteSubdirectoriesAndFiles'
        $inherit          = 'ContainerInherit,ObjectInherit'
        $propogation      = 'None'
    
    $user = 'US\' + $user + $projectId

    Write-Host("Providing permissions for $($user) for path - $($appPath)")

    $acl = Get-Acl $appPath
    $AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($user, $filesystemrights, $inherit, $propogation,'Allow')

    $acl.AddAccessRule($AccessRule)

    $acl | Set-Acl $appPath
}

switch ($action) {
    'createApps' {

        if(Test-Path -Path ($projectPath + '\' + $projectName)){
            Write-Host "Path already present" $projectName
            $pathPresent = 'Y'
        }
        else{
            $pathPresent = 'N'
        }
        createFolders; 

        
        if($pathPresent -eq 'N'){
            provideAccessSysAcc -user $fileContent.systemUsers
        
            provideAccessParent -user $fileContent.projectSG.User -userRole 'User';
            #provideAccessParent -user $fileContent.projectSG.Maintainer -userRole 'Maintainer';            
            #provideAccessParent -user $fileContent.projectSG.Reader -userRole 'Reader';
        }
        
        
        $relpath = $projectPath + '\' + $projectName
        
        #$subFoldersList = Get-ChildItem $relpath | Where-Object {$_.PSIsContainer} | Foreach-Object {$_.Name}

        foreach($folder in $apps){
            $appPath = $relpath + '\' + $folder

            $appUser = 'US\' + $fileContent.applicationSG.User + $folder

            provideAccessDFTE -user $appUser -relpath $appPath
            
            $subFoldersAppsList = Get-ChildItem $appPath | Where-Object {$_.PSIsContainer} | Foreach-Object {$_.Name}
            
            foreach($appFolder in $subFoldersAppsList){
                if($appFolder -in ('IN') -and ($folder -notin ('DPLOY'))){
                    $appInFolder = $appPath + '\' + $appFolder
                    #provideAccessChild -user $fileContent.projectSG.User -appPath $appInFolder;
                    provideAccessDFTEChild -user $appUser -appPath $appInFolder;
                }
                if($appFolder -in ('IN', 'OUT', 'SVN', 'GIT') -and ($folder -eq 'DPLOY')){
                    $appInFolder = $appPath + '\' + $appFolder
                    #provideAccessChild -user $fileContent.projectSG.User -appPath $appInFolder;
                    provideAccessDFTEChild -user $appUser -appPath $appInFolder;
                
            }
            
        }

        break 
    }
    'deleteApps' {
        deleteFolders; 
        break
    }
    'delete'{
        Remove-Item -Path $projectPath\$projectName -Recurse
        break;
    }
}

Remove-Variable -Name projectPath,action,apps #-Scope Script -ErrorAction Ignore -WarningAction Ignore