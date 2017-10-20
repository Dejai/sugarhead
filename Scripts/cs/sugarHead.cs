using System;
using System.IO;
using System.Security;
// using System.Windows.Controls; 

public class GetMusic {


	public static string musicPath = "../../music";

	public static void Main (String [] args){

		try{
			string [] albums = Directory.GetDirectories(musicPath);

			int x = 0;
			foreach (var al in albums){
				x++;
				if (x == 1){
					Console.WriteLine();
					Console.WriteLine("*** {0}", al.Substring(al.LastIndexOf("/")+1));
					printFiles(al);
				}
			}
			// Console.WriteLine("Hmm ... {0}", String.Join("", albums));
			// FileStream fs = new FileStream(musicPath, FileMode.Open, FileAccess.Read);
			// fs.Close();

		} catch (Exception ex){
			Console.WriteLine(ex.Message);
		}
		// Console.WriteLine(musicPath);
	}

	public static void printFiles(string directory){

		string [] files = Directory.GetFiles(directory);
		// MediaElement me = new MediaElement();
		int x = 0; 
		foreach (var file in files){
			x++;
			if (x == 1){
				FileInfo oFileInfo = new FileInfo(file);
		        Console.WriteLine("My File's Name: \"" + oFileInfo.Name + "\"");
		        DateTime dtCreationTime = oFileInfo.CreationTime;
		        Console.WriteLine("Date and Time File Created: " + dtCreationTime.ToString());
		        Console.WriteLine("myFile Extension: " + oFileInfo.Extension);
		        Console.WriteLine("myFile total Size: " + oFileInfo.Length.ToString());
		        Console.WriteLine("myFile filepath: " + oFileInfo.DirectoryName);
		        Console.WriteLine("My File's Full Name: \"" + oFileInfo.FullName + "\"");
			}
			// MusicProperties mp = xx.Properties.GetMusicPropertiesAsync();
			// Console.WriteLine("--> {0} - {1}", xx.Substring(xx.LastIndexOf("/")+1), mp.Album);
			// Console.WriteLine("--> {0}", xx.Substring(xx.LastIndexOf("/")+1));
		}
	}
}
