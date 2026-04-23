# Deployment Checklist - Customer Module Refactoring

**Date**: April 22, 2026
**Project**: Customer Module Refactoring
**Version**: 1.0

---

## Pre-Deployment (24 hours before)

### Planning & Preparation
- [ ] Schedule deployment window (low traffic time)
- [ ] Notify all teams (Dev, QA, Ops, Support)
- [ ] Prepare rollback plan
- [ ] Create backup strategy
- [ ] Brief stakeholders on expected downtime (if any)
- [ ] Assign deployment owner
- [ ] Assign on-call support person

### Code Review
- [ ] All code changes reviewed and approved
- [ ] No merge conflicts in main branch
- [ ] CI/CD pipeline passing
- [ ] All tests passing
- [ ] Code quality checks passed

### Testing in Staging
- [ ] Deploy to staging environment
- [ ] Run verify_refactoring.sh script
- [ ] Manual testing of all affected features
- [ ] Performance testing (if applicable)
- [ ] Load testing (if applicable)
- [ ] Database query performance verified

### Documentation
- [ ] All documentation files reviewed
- [ ] Deployment runbook prepared
- [ ] Rollback procedures documented
- [ ] Known issues documented
- [ ] Support team briefed on changes

### Database
- [ ] Database backup created and verified
- [ ] Database backup stored in safe location
- [ ] Migration script tested (if needed)
- [ ] Restore procedure tested

---

## Day of Deployment

### Pre-Deployment Final Checks
- [ ] All systems operational
- [ ] No critical issues in current production
- [ ] Deployment team ready
- [ ] All necessary access credentials available
- [ ] Monitoring tools ready
- [ ] Notification channels open

### Deployment Steps

#### 1. Backend Deployment
- [ ] Build JAR file: `mvn clean package -DskipTests`
- [ ] Verify JAR built successfully
- [ ] Stop current backend application
- [ ] Backup current JAR
- [ ] Deploy new JAR
- [ ] Verify application started
- [ ] Check logs for errors
- [ ] Wait 2-3 minutes for stability

#### 2. Database Migration (if needed)
- [ ] Run migration script: `SOURCE database/migration_refactor_customer.sql`
- [ ] Verify migration completed
- [ ] Check for errors in database logs
- [ ] Verify table structure is correct

#### 3. Frontend Deployment
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Verify build completed successfully
- [ ] Backup current frontend files
- [ ] Deploy new frontend files
- [ ] Clear CDN cache (if applicable)
- [ ] Verify assets loading
- [ ] Check for console errors

#### 4. Smoke Testing
- [ ] Backend APIs responding
- [ ] Frontend loads without errors
- [ ] Create test customer (without dates) - ✅ Success
- [ ] Edit test customer - ✅ Success
- [ ] View customer list - ✅ Success
- [ ] View call history - ✅ Success
- [ ] Create test call - ✅ Success

#### 5. Post-Deployment Verification
- [ ] Run verify_refactoring.sh: `bash verify_refactoring.sh`
- [ ] Review script output
- [ ] All API endpoints responding correctly
- [ ] No date fields in API responses
- [ ] No date fields in UI forms
- [ ] Call history accessible
- [ ] Last call info displaying correctly

#### 6. Monitoring & Logging
- [ ] Check application logs for errors
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Check database connections
- [ ] Monitor CPU/Memory usage
- [ ] Check for any warnings or alerts

---

## Post-Deployment (First 24 hours)

### Verification (Immediate - First Hour)
- [ ] No spike in error rates
- [ ] No unusual log entries
- [ ] User reports: No issues
- [ ] API monitoring: All green
- [ ] Database monitoring: Normal
- [ ] Customer operations: Normal

### Testing (First 4 Hours)
- [ ] All critical user paths tested
- [ ] Edge cases tested
- [ ] API endpoints verified manually
- [ ] Database queries performing well
- [ ] No unexpected behaviors observed
- [ ] Call history working correctly
- [ ] Follow-up tracking working (via calls)

### Monitoring (First 24 Hours)
- [ ] Continuous monitoring of:
  - [ ] Application logs
  - [ ] Error rates
  - [ ] Performance metrics
  - [ ] Database performance
  - [ ] API response times
  - [ ] User feedback
- [ ] Daily monitoring check-ins
- [ ] No escalations received

### Support Team
- [ ] Support team notified of changes
- [ ] Support team trained on new UI
- [ ] FAQ prepared for common questions
- [ ] Troubleshooting guide available
- [ ] Escalation procedures in place

---

## If Issues Occur

### Minor Issues (Can Fix)
1. [ ] Document the issue
2. [ ] Assess impact
3. [ ] Fix the issue
4. [ ] Test the fix
5. [ ] Deploy the fix
6. [ ] Verify resolution
7. [ ] Update documentation

### Critical Issues (Need Rollback)
1. [ ] Declare incident
2. [ ] Activate incident response
3. [ ] Stop all customer-affecting operations
4. [ ] Prepare to rollback
5. [ ] Execute rollback:
   - [ ] Stop backend application
   - [ ] Restore previous JAR
   - [ ] Restore database from backup (if needed)
   - [ ] Restore previous frontend files
   - [ ] Restart application
   - [ ] Verify rollback successful
6. [ ] Communicate status to stakeholders
7. [ ] Schedule post-mortem
8. [ ] Investigate root cause

---

## Rollback Procedure (If Needed)

### Database Rollback (If Migration Was Run)
```sql
-- Re-add columns if they were dropped
ALTER TABLE customers 
  ADD COLUMN date_of_inquiry DATE,
  ADD COLUMN follow_up_date DATE;

-- Or restore from backup
-- RESTORE TABLE customers FROM backup;
```

### Backend Rollback
```bash
# Stop current application
kill <PID>

# Restore previous JAR
cp backup-app.jar channel-partner-app.jar

# Restart with previous version
java -jar channel-partner-app.jar &
```

### Frontend Rollback
```bash
# Restore previous frontend files
rm -rf /var/www/html/*
cp -r backup-dist/* /var/www/html/

# Clear cache if using CDN
# Or simply refresh browser cache
```

### Verification After Rollback
- [ ] Application started successfully
- [ ] All systems operational
- [ ] No errors in logs
- [ ] Date fields present in forms again
- [ ] All functionality working
- [ ] Users can access system

---

## Post-Rollback Actions
- [ ] Communicate rollback to stakeholders
- [ ] Root cause analysis meeting scheduled
- [ ] Issues documented and categorized
- [ ] Fixes prepared for redeployment
- [ ] New testing plan prepared
- [ ] Redeploy scheduled (after fixes)

---

## Sign-Off Checklist

### Development Team
- [ ] Code changes reviewed: _________________ Date: _____
- [ ] Testing completed: _________________ Date: _____
- [ ] Ready for deployment: _________________ Date: _____

### QA Team
- [ ] Testing approved: _________________ Date: _____
- [ ] Issues resolved: _________________ Date: _____
- [ ] Ready for deployment: _________________ Date: _____

### Operations/DevOps
- [ ] Infrastructure ready: _________________ Date: _____
- [ ] Deployment plan approved: _________________ Date: _____
- [ ] Monitoring configured: _________________ Date: _____

### Project Manager/Stakeholder
- [ ] Deployment approved: _________________ Date: _____
- [ ] Stakeholders notified: _________________ Date: _____
- [ ] Success criteria defined: _________________ Date: _____

### Deployment Owner
- [ ] Deployment completed: _________________ Date: _____
- [ ] Verification completed: _________________ Date: _____
- [ ] All issues resolved: _________________ Date: _____

---

## Deployment Summary

**Deployment Date**: __________________  
**Deployment Time**: __________ to __________  
**Deployment Owner**: __________________  
**Status**: ☐ Success ☐ Partial Success ☐ Rolled Back

**Issues Encountered**: 
```
[Describe any issues and how they were resolved]
```

**Performance Impact**:
```
[Document any performance changes]
```

**Lessons Learned**:
```
[Document improvements for next deployment]
```

---

## Post-Deployment Follow-Up

### Day 1 (Immediate)
- [ ] All systems operational
- [ ] No critical issues reported
- [ ] Users reporting normal operations
- [ ] Metrics normal

### Day 3
- [ ] No regression issues reported
- [ ] System stable
- [ ] Performance metrics stable
- [ ] Database performance good

### Day 7
- [ ] No issues reported
- [ ] User feedback positive
- [ ] All metrics normal
- [ ] Deployment considered successful

### Day 30
- [ ] Final assessment completed
- [ ] All documentation updated
- [ ] Lessons learned documented
- [ ] Deployment archived

---

## Contact Information

**Deployment Owner**: _________________ Phone: _________________  
**On-Call Support**: _________________ Phone: _________________  
**Technical Lead**: _________________ Phone: _________________  
**Project Manager**: _________________ Phone: _________________  

**Escalation Contacts**:
- Level 1: _________________ Phone: _________________
- Level 2: _________________ Phone: _________________
- Level 3: _________________ Phone: _________________

---

## Important Reminders

✅ **Do Not Forget**:
1. Backup database before deployment
2. Test in staging first
3. Have rollback plan ready
4. Keep on-call support informed
5. Monitor logs after deployment
6. Communicate status to stakeholders
7. Run verification script
8. Save deployment logs for reference

❌ **Do Not**:
1. Deploy without backups
2. Skip staging environment
3. Ignore verification results
4. Assume everything is fine without monitoring
5. Forget to communicate with team
6. Leave verification incomplete
7. Deploy during peak traffic hours (if avoidable)

---

## Reference Documentation

- **REFACTORING_COMPLETION_REPORT.md** - Deployment instructions
- **CUSTOMER_REFACTORING_GUIDE.md** - API changes
- **REFACTORING_CUSTOMER_MODULE.md** - Technical details
- **verify_refactoring.sh** - Verification script
- **QUICK_REFERENCE_CUSTOMER_REFACTORING.md** - Quick reference

---

## Notes

```
[Use this space for additional notes, specific to your deployment]




```

---

**Print This Checklist**: Keep a printed copy with you during deployment!

**Version**: 1.0  
**Last Updated**: April 22, 2026  
**Deployment Status**: Ready ✅

