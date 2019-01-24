# Mona Fartlek analysis
library(rgdal)
X = readLines("C:/Users/beetonn/Downloads/Mona_Fartlek_20_min (5).gpx")
start = 0

# extraction
coords = unlist(lapply(strsplit(X[grep('<trkpt', X)], '"'), function(x) x[c(2,4)]))
coords = t(matrix(as.numeric(coords), 2, length(coords)/2))
coords = coords[,2:1]
coords.mga55 = project(coords, '+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', inv = FALSE)
time = X[grep('<time', X)][-1]
time = strptime(time, '   <time>%Y-%m-%dT%H:%M:%SZ</time>')
time = as.numeric(time - time[1])
ele = X[grep('<ele', X)]
ele = as.numeric(gsub('[^0-9\\-\\.]', '', ele))
#palette(rainbow(128))
#plot(coords.mga55, col = ele, pch=19)
dist = sqrt(diff(coords.mga55[,1])^2 + diff(coords.mga55[,2])^2)
vel = dist / diff(time) * 3.6
slope = diff(ele)/dist

par(cex=1.5, lwd=2)
plot(time[-1]/60, vel, type='o', 
     ylim = 60/rev(c(2.75, 6.25)), pch=19, cex=0.5, xlab = 'Time (mins)', 
     ylab = 'Pace (min/km)', axes = FALSE, xlim = start/60 + c(0,20))
axis(1)
axis(2, at = 60/seq(3,6,0.5), labels = c('3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00'), las = 1)
box(bty = 'O')

laps = start + c(90*(0:4), 360+60*(1:8), 840+30*(1:8), 1080+15*(1:8))
abline(v = c(0,laps)/60, col='grey', lty=2)
abline(h = 60/seq(3,4,0.25), col='grey', lty=2)
t.dist = cumsum(dist)
find.dist = function(times)
{
  dists = numeric(length(times))
  for (i in 1:length(times))
  {
    t = times[i]
    ii = max(which(time <= t))
    if (time[ii] == t)
      if (ii == 1)
        dists[i] = 0
      else
        dists[i] = t.dist[ii-1]
    else
      dists[i] = t.dist[ii-1] + (t - time[ii])/(time[ii+1]-time[ii]) * (t.dist[ii]-t.dist[ii-1])
  }
  dists
}
dists = find.dist(laps)
dists = diff(dists)
laps = laps[-1]
#dists = diff(c(0,dists))
vels = dists / rep(c(90, 60, 30, 15), times = c(4,8,8,8)) * 3.6
#paces = 60/vels
lines(c(start, rep(laps[-length(laps)], each = 2), laps[length(laps)])/60, 
      rep(vels, each=2), col='violet', lwd=5)
# normal
zones = c(mean(vels[c(1,3)]),
          mean(vels[c(5,7,9,11)]),
          mean(vels[c(13,15,17,19)]),
          mean(vels[c(21,23,25,27)]),
          sum(vels[seq(2,28,2)]*rep(c(1.5, 1, 0.5, 0.25), times = c(2,4,4,4)))/10
)
# reverse
# zones = c(mean(vels[c(2,4)]), 
#           mean(vels[c(6,8,10,12)]), 
#           mean(vels[c(14,16,18,20)]), 
#           mean(vels[c(22,24,26,28)]), 
#           sum(vels[seq(1,28,2)]*rep(c(1.5, 1, 0.5, 0.25), times = c(2,4,4,4)))/10
# )

zone.paces = 60 /zones
lines(start/60+c(0,6), rep(zones[1], 2), col='#00B000', lwd=5, lty=2)
text(start/60+3, zones[1], sprintf('%d:%02d', 
                          round(60*zone.paces[1])%/%60, round(60*zone.paces[1])%%60), 
     pos = 3, col = '#00B000', cex=2)
lines(start/60+c(6,14), rep(zones[2], 2), col='#B0B000', lwd=5, lty=2)
text(start/60+10, zones[2], sprintf('%d:%02d',
                           round(60*zone.paces[2])%/%60, round(60*zone.paces[2])%%60),
     pos = 3, col = '#B0B000', cex=2)
lines(start/60+c(14,18), rep(zones[3], 2), col='#B06000', lwd=5, lty=2)
text(start/60+16, zones[3], sprintf('%d:%02d',
                           round(60*zone.paces[3])%/%60, round(60*zone.paces[3])%%60), 
     pos = 3, col = '#B06000', cex=2)
lines(start/60+c(18,20), rep(zones[4], 2), col='#B00000', lwd=5, lty=2)
text(start/60+19, zones[4], sprintf('%d:%02d',
                           round(60*zone.paces[4])%/%60, round(60*zone.paces[4])%%60), 
     pos = 3, col = '#B00000', cex=2)
lines(start/60+c(0,20), rep(zones[5], 2), col='#0000B0', lwd=5, lty=2)
text(start/60+10, zones[5], sprintf('%d:%02d',
                           round(60*zone.paces[5])%/%60, round(60*zone.paces[5])%%60), 
     pos = 1, col = '#0000B0', cex=2)
