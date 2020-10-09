import sys
###################################################
# Call Python Script
###################################################
try:
    var1 = sys.argv[1]
    print("Message from Python Script - ", var1)
except Exception as e:
    print("Exception Message - ", str(e))
###################################################
# End of Script
###################################################