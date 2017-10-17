using System;
using System.IO;

public class GetMusic {


	public static string musicPath = "../../music/Band A Lion/";

	public static void Main (String [] args){

		try{
			FileStream fs = new FileStream(musicPath, FileMode.Open);
			fs.Close();

		} catch (Exception ex){
			Console.WriteLine(ex.Message);		
		}
		Console.WriteLine(musicPath);
	}
}