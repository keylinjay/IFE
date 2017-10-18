#windows ps script 
#layout to readme.md 
#author:linjay
#createdate:2016-12-11
#update:2016-12-11

#(test-path README.MD) -and (rm README.MD);
(Test-Path .\index.html) -and (rm .\index.html);
(Test-Path .\test1) -and (rm .\test1);
(Test-Path .\test) -and (rm .\test);
#def locale pre path
$lppath=$(pwd).path.replace("\","/");
#def remote pre path
$rppath='https://keylinjay.github.io/IFE-baidu-front-end-lessons-practice'

ls .\2016_spring -r |?{$_.name -like '*.html'}| foreach-object{$path=$_.versioninfo.filename.replace("\","/");
    $link=$path.replace($lppath,$rppath);
    $linkname=$link.replace("/index.html","");
    $linkname=$linkname.replace($rppath,"");
    $indexlink=$path.replace($lppath, ".");
    # echo "[$linkname]($link)">>test;
    # echo "">> test;
    echo "<h2><a href=$indexlink>$linkname</a></h2>" >> test1;
}
ls .\2017_spring -r |?{$_.name -like '*.html'}| foreach-object{$path=$_.versioninfo.filename.replace("\","/");
    $link=$path.replace($lppath,$rppath);
    $linkname=$link.replace("/index.html","");
    $linkname=$linkname.replace($rppath,"");
    $indexlink=$path.replace($lppath, ".");
    # echo "[$linkname]($link)">>test;
    # echo "">> test;
    echo "<h2><a href=$indexlink>$linkname</a></h2>" >> test1;
}
#get-content test | out-file README.MD -encoding utf8;
get-content test1 | Out-File index.html -Encoding utf8;
rm .\test1;