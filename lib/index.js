var create = function(withDiagnostics) {
  if(withDiagnostics) {
    return require('./diagnostics/busDiagnostics');
  }
  return require('./bus');
};


module.exports.create = create;
