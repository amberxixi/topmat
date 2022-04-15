from flask import request, Response
from flask_restful import Resource
from main import db
from server.resources.package import utilJSON
from collections import defaultdict

def filter(mat, keys):
    rtn = {}
    for k in keys:
        if k in mat:
            rtn[k] = mat[k]
        elif len(k.split('.')) == 2:
            k0, k1 = k.split('.')
            try:
                rtn[k] = mat[k0][k1]
            except KeyError:
                pass
    return rtn


class Materials(Resource):

    return_keys = ['id', 'formula', 'spacegroup', 'nsoc_topo_class', 'soc_topo_class',
            'nsoc_dos_gap', 'soc_dos_gap']

    def get(self):
        return self._get()           

    def get(self):
        return self._get()

    def _get(self):
        query = defaultdict(dict)
        
        for key in request.args:
            value = request.args[key]
            query[key] = value
            print(key)
            print(value)
        
        print(query)
        materials = db.materials.find(query).limit(30000)
        materials = [filter(mat, self.return_keys) for mat in materials]
        return Response(utilJSON.encoder.encode({'count': len(materials), 'materials': materials}))


class MaterialDetail(Resource):

    return_keys = ['id', 'formula', 'elements', 'elements_num', 'mp_id', 
                    'icsd_ids', 'nelec', 'nsites', 'spacegroup', 'conv_cif_str',
                    'prim_cif_str', 'BZ', 'nsoc_efermi', 'nsoc_dos', 'nsoc_fermi_dos',
                    'nsoc_dos_gap', 'nsoc_indirect_gap', 'nsoc_band', 'nsoc_topo_class', 'soc_efermi',
                    'soc_dos', 'soc_fermi_dos', 'soc_dos_gap', 'soc_indirect_gap', 'soc_band',
                    'soc_topo_class', 'nelem', 'elements_num_simp']

    def get(self):
        return self._get()

    def _get(self):
        query = defaultdict(dict)
        
        for key in request.args:
            value = request.args[key]
            query[key] = value
            print(key)
            print(value)
        
        print(query)
        # query = {"id": "MAT00001352"}
        materials = db.materials.find(query).limit(30000)
        materials = [filter(mat, self.return_keys) for mat in materials]
        return Response(utilJSON.encoder.encode({'materials': materials}))



