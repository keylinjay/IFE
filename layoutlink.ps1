#windows ps script 
#layout to readme.md 
#author:linjay
#createdate:2016-12-11
#update:2016-12-11

(test-path README.MD) -and (rm README.MD)
#def locale pre path
$lppath=$(pwd).path.replace("\","/")
#def remote pre path
$rppath='https://keylinjay.github.io/IFE-baidu-front-end-lessons-practice'

# ls .\2016_spring -r |?{$_.name -like '*.html'}| foreach-object{$path=$_.versioninfo.filename.replace("\","/");
#     $link=$path.replace($lppath,$rppath);
#     $linkname=$link.replace("/index.html","");
#     $linkname=$linkname.replace($rppath,"");
#     echo "[$linkname]($link)">>test;
#     echo "">> test;
# }
ls .\2017_spring -r |?{$_.name -like '*.html'}| foreach-object{$path=$_.versioninfo.filename.replace("\","/");
    $link=$path.replace($lppath,$rppath);
    $linkname=$link.replace("/index.html","");
    $linkname=$linkname.replace($rppath,"");
    echo "[$linkname]($link)">>test;
    echo "">> test;
}
get-content test | out-file README.MD -encoding utf8
rm test
