export function saveProjectToLocal(projectData: { roomShape: any; placedFurniture: any }) {
  try {
    const serialized = JSON.stringify(projectData);
    localStorage.setItem('furnishAR_project', serialized);
    alert('Project saved locally.');
  } catch (error) {
    console.error('Error saving project:', error);
    alert('Failed to save project.');
  }
}

export function exportProjectAsJSON(projectData: { roomShape: any; placedFurniture: any }) {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "furnishAR_project_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } catch (error) {
    console.error('Error exporting project:', error);
    alert('Failed to export project.');
  }
}
