#!/bin/bash

for d in {0..364}; do
  #for h in {0..11}; do
  for h in 0 12; do
    date -d "2017-01-01 + $d days + $h hours" +"%s";
    #h2=$(( $h+12 ));
    #custom=$(date -d "2017-01-01 + $d days + $h hours" +"%s";)
    #custom2=$(date -d "2017-01-01 + $d days + $h2 hours" +"%s";)
    echo $custom $custom2
    #curl localhost:8005/map.php?custom=${custom} &
    curl localhost:8005/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h   )) hours" +"%s") &
    curl localhost:8006/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+1 )) hours" +"%s") &
    curl localhost:8007/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+2 )) hours" +"%s") &
    curl localhost:8008/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+3 )) hours" +"%s") &
    curl localhost:8009/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+4 )) hours" +"%s") &
    curl localhost:8010/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+5 )) hours" +"%s") &
    curl localhost:8011/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+6 )) hours" +"%s") &
    curl localhost:8012/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+7 )) hours" +"%s") &
    curl localhost:8013/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+8 )) hours" +"%s") &
    curl localhost:8014/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+9 )) hours" +"%s") &
    curl localhost:8015/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+10)) hours" +"%s") &
    curl localhost:8016/map.php?custom=$(date -d "2017-01-01 + $d days + $(( $h+11)) hours" +"%s") 
  done;
done
