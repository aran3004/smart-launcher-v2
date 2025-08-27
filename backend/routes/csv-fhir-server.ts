import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.use(cors());

const handlePatientSearch = (req: any, res: any) => {
    try {
        const bundlePath = path.join(__dirname, '../../test/mocks/csv-patients-bundle.json');
        const bundleData = fs.readFileSync(bundlePath, 'utf8');
        const bundle = JSON.parse(bundleData);
        
        let filteredEntries = bundle.entry || [];
        
        const nameContains = req.query['name:contains'] || req.body?.['name:contains'];
        const patientId = req.query['_id'] || req.body?.['_id'];
        const identifier = req.query['identifier'] || req.body?.['identifier'];
        
        if (nameContains) {
            const searchTerm = nameContains.toLowerCase();
            filteredEntries = filteredEntries.filter((entry: any) => {
                const patient = entry.resource;
                if (!patient || !patient.name) return false;
                
                return patient.name.some((name: any) => {
                    const family = (name.family || '').toLowerCase();
                    const given = (name.given || []).join(' ').toLowerCase();
                    const fullName = `${given} ${family}`.toLowerCase();
                    
                    return family.includes(searchTerm) || 
                           given.includes(searchTerm) || 
                           fullName.includes(searchTerm);
                });
            });
        }
        
        if (patientId) {
            const ids = patientId.split(',').map((id: string) => id.trim());
            filteredEntries = filteredEntries.filter((entry: any) => {
                return ids.includes(entry.resource?.id);
            });
        }
        
        if (identifier) {
            filteredEntries = filteredEntries.filter((entry: any) => {
                const patient = entry.resource;
                if (!patient || !patient.identifier) return false;
                
                return patient.identifier.some((id: any) => {
                    return id.value === identifier;
                });
            });
        }
        
        const filteredBundle = {
            ...bundle,
            total: filteredEntries.length,
            entry: filteredEntries
        };
        
        res.set({
            'Content-Type': 'application/fhir+json',
            'Cache-Control': 'no-cache'
        });
        
        res.json(filteredBundle);
    } catch (error) {
        console.error('Error serving CSV patient bundle:', error);
        res.status(500).json({
            resourceType: 'OperationOutcome',
            issue: [{
                severity: 'error',
                code: 'exception',
                diagnostics: 'Failed to load CSV patient data'
            }]
        });
    }
};

router.get('/Patient', handlePatientSearch);
router.post('/Patient/_search', handlePatientSearch);

router.get('/Patient/:id', (req, res) => {
    try {
        const bundlePath = path.join(__dirname, '../../test/mocks/csv-patients-bundle.json');
        const bundleData = fs.readFileSync(bundlePath, 'utf8');
        const bundle = JSON.parse(bundleData);
        
        const patientId = req.params.id;
        const patient = bundle.entry?.find((entry: any) => 
            entry.resource?.id === patientId || 
            entry.resource?.identifier?.some((id: any) => id.value === patientId)
        );
        
        if (patient) {
            res.set({
                'Content-Type': 'application/fhir+json',
                'Cache-Control': 'no-cache'
            });
            res.json(patient.resource);
        } else {
            res.status(404).json({
                resourceType: 'OperationOutcome',
                issue: [{
                    severity: 'error',
                    code: 'not-found',
                    diagnostics: `Patient with id ${patientId} not found`
                }]
            });
        }
    } catch (error) {
        console.error('Error serving CSV patient:', error);
        res.status(500).json({
            resourceType: 'OperationOutcome',
            issue: [{
                severity: 'error',
                code: 'exception',
                diagnostics: 'Failed to load CSV patient data'
            }]
        });
    }
});

const handlePractitionerSearch = (req: any, res: any) => {
    try {
        const bundlePath = path.join(__dirname, '../../test/mocks/csv-practitioners-bundle.json');
        const bundleData = fs.readFileSync(bundlePath, 'utf8');
        const bundle = JSON.parse(bundleData);
        
        let filteredEntries = bundle.entry || [];
        
        const nameContains = req.query['name:contains'] || req.body?.['name:contains'];
        const practitionerId = req.query['_id'] || req.body?.['_id'];
        const identifier = req.query['identifier'] || req.body?.['identifier'];
        
        if (nameContains) {
            const searchTerm = nameContains.toLowerCase();
            filteredEntries = filteredEntries.filter((entry: any) => {
                const practitioner = entry.resource;
                if (!practitioner || !practitioner.name) return false;
                
                return practitioner.name.some((name: any) => {
                    const family = (name.family || '').toLowerCase();
                    const given = (name.given || []).join(' ').toLowerCase();
                    const fullName = `${given} ${family}`.toLowerCase();
                    
                    return family.includes(searchTerm) || 
                           given.includes(searchTerm) || 
                           fullName.includes(searchTerm);
                });
            });
        }
        
        if (practitionerId) {
            const ids = practitionerId.split(',').map((id: string) => id.trim());
            filteredEntries = filteredEntries.filter((entry: any) => {
                return ids.includes(entry.resource?.id);
            });
        }
        
        if (identifier) {
            filteredEntries = filteredEntries.filter((entry: any) => {
                const practitioner = entry.resource;
                if (!practitioner || !practitioner.identifier) return false;
                
                return practitioner.identifier.some((id: any) => {
                    return id.value === identifier;
                });
            });
        }
        
        const filteredBundle = {
            ...bundle,
            total: filteredEntries.length,
            entry: filteredEntries
        };
        
        res.set({
            'Content-Type': 'application/fhir+json',
            'Cache-Control': 'no-cache'
        });
        
        res.json(filteredBundle);
    } catch (error) {
        console.error('Error serving CSV practitioner bundle:', error);
        res.status(500).json({
            resourceType: 'OperationOutcome',
            issue: [{
                severity: 'error',
                code: 'exception',
                diagnostics: 'Failed to load CSV practitioner data'
            }]
        });
    }
};

router.get('/Practitioner', handlePractitionerSearch);
router.post('/Practitioner/_search', handlePractitionerSearch);

router.get('/Practitioner/:id', (req, res) => {
    try {
        const bundlePath = path.join(__dirname, '../../test/mocks/csv-practitioners-bundle.json');
        const bundleData = fs.readFileSync(bundlePath, 'utf8');
        const bundle = JSON.parse(bundleData);
        
        const practitionerId = req.params.id;
        const practitioner = bundle.entry?.find((entry: any) => 
            entry.resource?.id === practitionerId || 
            entry.resource?.identifier?.some((id: any) => id.value === practitionerId)
        );
        
        if (practitioner) {
            res.set({
                'Content-Type': 'application/fhir+json',
                'Cache-Control': 'no-cache'
            });
            res.json(practitioner.resource);
        } else {
            res.status(404).json({
                resourceType: 'OperationOutcome',
                issue: [{
                    severity: 'error',
                    code: 'not-found',
                    diagnostics: `Practitioner with id ${practitionerId} not found`
                }]
            });
        }
    } catch (error) {
        console.error('Error serving CSV practitioner:', error);
        res.status(500).json({
            resourceType: 'OperationOutcome',
            issue: [{
                severity: 'error',
                code: 'exception',
                diagnostics: 'Failed to load CSV practitioner data'
            }]
        });
    }
});

const handleEncounterSearch = (req: any, res: any) => {
    try {
        const bundlePath = path.join(__dirname, '../../test/mocks/csv-encounters-bundle.json');
        const bundleData = fs.readFileSync(bundlePath, 'utf8');
        const bundle = JSON.parse(bundleData);
        
        let filteredEntries = bundle.entry || [];
        
        const encounterId = req.query['_id'] || req.body?.['_id'];
        const patient = req.query['patient'] || req.body?.['patient'];
        const subject = req.query['subject'] || req.body?.['subject'];
        
        if (encounterId) {
            const ids = encounterId.split(',').map((id: string) => id.trim());
            filteredEntries = filteredEntries.filter((entry: any) => {
                return ids.includes(entry.resource?.id);
            });
        }
        
        if (patient || subject) {
            const patientRef = patient || subject;
            filteredEntries = filteredEntries.filter((entry: any) => {
                const encounter = entry.resource;
                if (!encounter || !encounter.subject) return false;
                
                return encounter.subject.reference === patientRef ||
                       encounter.subject.reference === `Patient/${patientRef}` ||
                       encounter.subject.reference.endsWith(`/${patientRef}`);
            });
        }
        
        const filteredBundle = {
            ...bundle,
            total: filteredEntries.length,
            entry: filteredEntries
        };
        
        res.set({
            'Content-Type': 'application/fhir+json',
            'Cache-Control': 'no-cache'
        });
        
        res.json(filteredBundle);
    } catch (error) {
        console.error('Error serving CSV encounter bundle:', error);
        res.status(500).json({
            resourceType: 'OperationOutcome',
            issue: [{
                severity: 'error',
                code: 'exception',
                diagnostics: 'Failed to load CSV encounter data'
            }]
        });
    }
};

router.get('/Encounter', handleEncounterSearch);
router.post('/Encounter/_search', handleEncounterSearch);

router.get('/Encounter/:id', (req, res) => {
    try {
        const bundlePath = path.join(__dirname, '../../test/mocks/csv-encounters-bundle.json');
        const bundleData = fs.readFileSync(bundlePath, 'utf8');
        const bundle = JSON.parse(bundleData);
        
        const encounterId = req.params.id;
        const encounter = bundle.entry?.find((entry: any) => 
            entry.resource?.id === encounterId
        );
        
        if (encounter) {
            res.set({
                'Content-Type': 'application/fhir+json',
                'Cache-Control': 'no-cache'
            });
            res.json(encounter.resource);
        } else {
            res.status(404).json({
                resourceType: 'OperationOutcome',
                issue: [{
                    severity: 'error',
                    code: 'not-found',
                    diagnostics: `Encounter with id ${encounterId} not found`
                }]
            });
        }
    } catch (error) {
        console.error('Error serving CSV encounter:', error);
        res.status(500).json({
            resourceType: 'OperationOutcome',
            issue: [{
                severity: 'error',
                code: 'exception',
                diagnostics: 'Failed to load CSV encounter data'
            }]
        });
    }
});

export default router;
