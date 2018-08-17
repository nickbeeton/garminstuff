#-----------------------------
# BEFORE RUNNING THIS R SCRIPT
#
# Download activity fit files from Garmin Express using Javascript code "bulk activities.js"
# and daily summary fit files using Javascript code "bulk summaries.js"
# Original version of activity code provided by lightmatter on the Garmin forums
# Thread here: https://forums.garmin.com/forum/into-sports/garmin-connect/141423-
# Code here: https://pastebin.com/YN6Gex5R
# (note: we simply replace "export/tcx" with "files" for raw FIT)
#
# And download FIT SDK here:
# https://www.thisisant.com/resources/fit/
#
# Finally tell R where your data files and the FIT SDK are:
data.folder = "C:/Users/bob/Downloads/"
fitsdk.folder = "C:\\Program Files\\FitSDKRelease_20.67.00"
#-----------------------------


setwd(data.folder)
# Extract VO2 max data from all available activities
# Assumes all activities are in zipped files with 10 digit numbers as filename
L = list.files(pattern = '[0-9]{10}.zip')
vo2max.vec = NULL
time.vec = NULL
for (l in L)
{
  fitfile = gsub('zip', 'fit', l)
  if (!file.exists(fitfile))  unzip(l)
  
  csvfile = gsub('zip', 'csv', l)
  if (!file.exists(csvfile))  
    system(sprintf('"%s\\java\\FitToCSV.bat" "%s\\%s"',
                   fitsdk.folder, gsub('/', '\\\\', data.folder), fitfile))
  
  tmp = read.csv(csvfile)
  vo2max = tmp$Value.6[max(which(tmp$Message == 'record'))+2]/ (1024*64/3.5)
  timestamp = strptime('1989-12-31 00:00:00', '%Y-%m-%d %H:%M:%S')+tmp$Value.2[2]
  vo2max.vec = c(vo2max.vec, vo2max)
  time.vec = c(time.vec, timestamp)
}

# strip unrealistic VO2 max values
vo2max.vec[vo2max.vec < 10 | vo2max.vec > 99] =  NA
time.vec = time.vec[!is.na(vo2max.vec)]
vo2max.vec = vo2max.vec[!is.na(vo2max.vec)]

# Plot time series
par(cex=1.5, lwd=2)
plot(as.POSIXct(time.vec, origin='1970-01-01 00:00:00'), vo2max.vec, xlab = 'Date', ylab = expression('VO'[2]*' max'), type='n')
abline(h = 10:99, lty=3, col='grey')
lines(as.POSIXct(time.vec, origin='1970-01-01 00:00:00'), vo2max.vec, type='o', pch=19, cex=0.5)

# Extract HR data from all available daily summaries
# Assumes all summaries are in zipped files in YYYY-MM-DD.zip format
L = list.files(pattern = '[0-9]{4}-[0-9]{2}-[0-9]{2}.zip')
hr.vec = NULL
time.vec = NULL
start = TRUE
for (l in L)
{
  folder = gsub('\\.zip', '', l)
  if (!file.exists(folder))  unzip(l, exdir = folder)
  
  L2 = list.files(folder, pattern = 'fit')
  for (fitfile in L2)
  {
    csvfile = gsub('fit', 'csv', fitfile)
    if (!file.exists(csvfile))  
      system(sprintf('"%s\\java\\FitToCSV.bat" "%s\\%s\\%s"',
                     fitsdk.folder, gsub('/', '\\\\', data.folder), folder, fitfile))
    
    tmp = read.csv(sprintf('%s/%s', folder, csvfile), stringsAsFactors = FALSE)
    tmp$Value.1 = as.integer(tmp$Value.1)
    tmp$Value.2 = as.integer(tmp$Value.2)
    
    if (any(tmp$Field.1 == 'timestamp_16') & any(tmp$Field.2 == 'heart_rate'))
    {
      ii = which(tmp$Field.1 == 'timestamp_16' & tmp$ï..Type == 'Data')
      for (j in ii)
      {
        jj = which(tmp$Field.1[1:(j-1)] == 'timestamp')
        tmp$Value.1[j] = tmp$Value.1[j] + floor(tmp$Value.1[max(jj)]/2^16)*2^16
      }
      
      time = strptime('00:00:00 31/12/1989 +0000', '%H:%M:%S %d/%m/%Y %z')+tmp$Value.1[ii]
      if (!start)
      {
        time.vec = c(time.vec, time)
        hr.vec = c(hr.vec, tmp$Value.2[ii])
      }
      else
      {
        time.vec = time
        hr.vec = tmp$Value.2[ii]
        start = FALSE
      }
    }
  }
}

# Strip unrealistic HR values (may need to tweak this)
hr.vec[hr.vec<36] = NA
date.vec = as.POSIXct(time.vec, origin='1970-01-01 00:00:00')
# Simple plot of HR vs time over all data
par(cex=1.5, lwd=2)
plot(date.vec, hr.vec, type='l')

# Example analysis 
# Pick out the 20th smallest recorded HR value for each day, call it the minimum
# (Acts as a very simple filter for noise)
date.vec = substring(date.vec, 1, 10)
minHR = aggregate(list(HR = hr.vec), by = list(date = date.vec), FUN = function(x) sort(x)[20])
minHR$date = strptime(minHR$date, '%Y-%m-%d')
# Plot results
par(cex=1.5, lwd=2)
plot(minHR, pch=19, xlab = 'Date', ylab = 'Minimum HR')
