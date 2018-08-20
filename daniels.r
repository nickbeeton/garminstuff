vdot = function(t, dist){
  PERCENT_MAX = 0.8 + 0.1894393 * exp(-0.012778 * t) + 0.2989558 * exp(-0.1932605 * t)
  VO2 = -4.6 + 0.182258 * (dist/t) + 0.000104 * (dist/t)^2
  vdot = VO2 / PERCENT_MAX
  vdot
}

t = function(vdot, dist)
{
  optimise(function(t) (vdot(t,dist)-vdot)^2, c(0, 1440))$minimum
}

vdot.5km = vo2max.vec + (vdot(18+25/60, 5000) - vo2max.vec[202])
vdot.10km = vo2max.vec + (vdot(39+54/60, 10000) - vo2max.vec[153])

t.5km = sapply(vdot.5km, t, dist = 5000)
t.10km = sapply(vdot.10km, t, dist=10000)

plot(as.POSIXct(time.vec, origin='1970-01-01 00:00:00'), t.5km, 
     xlab = 'Date', ylab = expression('Predicted 5km time'),
     type='o', pch=19, cex=0.5)
abline(v = time.vec[202], h = 18+25/60, col='grey', lty=3)
abline(v = as.POSIXct(strptime('2018-05-20', '%Y-%m-%d')), h = 19+43/60, col='grey', lty=3)
abline(v = as.POSIXct(strptime('2018-05-12', '%Y-%m-%d')), h = 20+19/60, col='grey', lty=3)
abline(v = as.POSIXct(strptime('2018-02-10', '%Y-%m-%d')), h = 21+8/60, col='grey', lty=3)


plot(as.POSIXct(time.vec, origin='1970-01-01 00:00:00'), t.10km, 
     xlab = 'Date', ylab = expression('Predicted 10km time'),
     type='o', pch=19, cex=0.5)
abline(v = time.vec[153], h = 39+54/60, col='grey', lty=3)
